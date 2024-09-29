import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { JSONArray ,JSONObject,JSONPrimitive} from "hono/utils/types";
import { verify } from "hono/utils/jwt/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
// type InputJsonValue = JSONArray | JSONObject | JSONPrimitive | null |undefined;
const app = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:SignatureKey
    }
}>()
export const addExpense = app.post('/addexpense',async (c)=>{
    const prisma = new PrismaClient({
       datasourceUrl : c.env?.DATABASE_URL 
    })
    
    const body:{
        // id : string, 
         
        Name : string,
        Total : number,
        DivideTo : string[],
        groupId : string 
    } = await c.req.json();
    const token: string | undefined = c.req.header('token')?.split(' ')[1];
    if (!token) {
        return c.json({ msg: "No token provided" ,token});
    }
    
    
    let decoded;
    try {
        decoded = await verify(token, c.env.JWT_SECRET) ;
    } catch (error) {
        console.log("Token verification failed:", error);
        return c.json({ msg: "Token verification failed" });
    }
    
    const user = await prisma.user.findUnique({
        where:{
            // id : body.id,
            username : (decoded as { username: string }).username 
        }
    } )
    body.Total = parseFloat(body.Total.toString());
    const expense = await prisma.expense.create({
        data:{
            Name : body.Name,
            createdBy : user?.username || "",
            Total : body.Total,
            DivideTo : body.DivideTo,
            authorId : user?.id,
            groupId : body.groupId,
            Owes : [],
            Lent:  []
        }
    })
    if (user) {
        user.MoneyLent = user.MoneyLent + (expense.Total * 9) / 10
    }
    
    const all = await prisma.user.findMany({
        where: {
            username: { in: expense.DivideTo as string[] ?? [] }
        }
    })
    let checkifUser = false;
    for (const element of all) {
        if (element.id != user?.id) {
            const name = await prisma.user.findUnique({
                where: { id: element.id },
                select: { oweTo: true }
            });
    
            let updateOweto = Array.isArray(name?.oweTo) ? name?.oweTo : [] as Array<any>;
    
            // Check if user.username already exists in oweTo array
            const existingEntryIndex = updateOweto.findIndex((entry: any) => entry.user === user?.username);
            if (existingEntryIndex !== -1 ) {
                // Update the existing entry's value
                if (updateOweto && updateOweto[existingEntryIndex] && updateOweto[existingEntryIndex].username != user?.username) {
                    updateOweto[existingEntryIndex].value += expense.Total / all.length;
                }
            } else {
                // Add a new entry
                updateOweto.push({ user: user?.username, value: expense.Total / all.length });
            }
            if(!expense.Lent){expense.Lent = []};
            if (!Array.isArray(expense.Lent) ) {
                expense.Lent = [];
            }
            
            expense.Lent.push({ user: user?.username || "", value: expense.Total / all.length });
            // console.log(name);
            const ele = await prisma.user.update({
                where: {
                    id: element.id,
                },
                data: {
                    MoneyOwe: { increment: expense.Total / (all.length) },
                    oweTo: updateOweto
                }
            });
        } else {
            checkifUser = true;
        }
        
    }
    
    const updatedlenTo: Array<any> = Array.isArray(user?.lendTo) ? [...user.lendTo] : [];

all.forEach(element => {
    const existingEntryIndex = updatedlenTo.findIndex(entry => entry.user === element?.username);
    if (existingEntryIndex !== -1) {
        // Update the existing entry's value
        updatedlenTo[existingEntryIndex].value += expense.Total / all.length;
        
    } else {
        // Add a new entry
        updatedlenTo.push({
            user: element?.username,
            value: expense.Total / all.length
        });
        
    }
    if(!expense.Owes){expense.Owes = []};
            if (!Array.isArray(expense.Owes) ) {
                expense.Owes = [];
            }
            expense.Owes.push({ user: element?.username,
                value: expense.Total / all.length });
   
});
    const updated = await prisma.user.update({
        where:{
            id:user?.id,
        },
        data:{
            
            MoneyLent:{ increment : checkifUser ? ((expense.Total) * (all.length-1))/all.length : expense.Total},
            lendTo : updatedlenTo
        }
    })
    const group = await prisma.group.update({
    where:{
        id :body.groupId,
    } ,
    data:{
        TotalSpent:{
            increment : expense.Total
        }
    }       
    })
    
    return c.json({msg:"expense created succesfully",all})
})

