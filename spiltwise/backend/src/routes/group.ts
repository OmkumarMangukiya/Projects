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
export const createGroup = app.post('/create', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const token = await c.req.header('authorization');
    // return c.json({msg : `token is ${token}`,token})

    if (!token) {
        c.status(401);
        console.log("Token is invalid");
        return c.json({ msg: "Token is invalid" ,token});
    }

    let decoded;
    try {
        decoded = await verify(token, c.env.JWT_SECRET);
    } catch (error) {
        console.log("Token verification failed:", error);
        return c.json({ msg: "Token verification failed" });
    }

    const userId =  (decoded as any)?.id as string;
    if (!userId) {
        console.log("User ID not found in token");
        return c.json({ msg: "User ID not found in token" ,decoded});
    }

    try {
        const group = await prisma.group.create({
            data: {
                Name: body.name,
                TotalSpent: 0,
                userId: userId // Include the userId in the data object
            }
        });

        console.log("Group created successfully:", group);
        return c.json({ msg: "Group created successfully", group });
    } catch (error) {
        console.error('Error creating group:', error);
        c.status(500);
        return c.json({ msg: 'Internal Server Error' });
    }
});
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
            groupId : body.groupId
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
    let x = false;
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
    
            console.log(name);
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
            x = true;
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
});
    const updated = await prisma.user.update({
        where:{
            id:user?.id,
        },
        data:{
            
            MoneyLent:{ increment : x ? ((expense.Total) * (all.length-1))/all.length : expense.Total},
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

export const openGroup = app.get('/opengroup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    });

    const authHeader = c.req.header('token');
    if (!authHeader) {
        console.log("Authorization header not found");
        c.status(401)
        return c.json({ msg: 'Authorization header not found' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        console.log("Token not found in Authorization header");
        c.status(401)
        return c.json({ msg: 'Token not found in Authorization header' });
    }

    console.log("Token:", token);
    console.log("Secret Key:", c.env.JWT_SECRET);

    let decoded;
    try {
        decoded = await verify(token, c.env.JWT_SECRET);
    } catch (error) {
        console.log("Token verification failed:", error);
        c.status(401)
        return c.json({ msg: 'Token verification failed' });
    }
    console.log("decoded" + decoded)
    const userId = await (decoded as any)?.userId;
    if (!userId) {
        console.log("User ID not found in token");
        c.status(401)
        return c.json({ msg: 'User ID not found in token' });
    }

    console.log(" user id "+userId);
    try {
        const groups = await prisma.group.findMany({
            where: {
                userId: userId,
            }
        });
        console.log(typeof groups);
        return c.json(groups);
    } catch (error) {
        console.error('Error fetching groups:', error);
        c.status(500)
        return c.json({ msg: 'Internal Server Error' });
    }
});
export const getGroupById = app.get('/opengroup/id',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    })
    const groupId = c.req.query('id');
    console.log(groupId)
    try{
        const group = await prisma.group.findUnique({
            where : {id:groupId},
        })
        if(!group){
            return c.status(404);
        }
        const expenses = await prisma.expense.findMany({
            where : {
                groupId : group.id
            }
        })
        console.log(expenses)
        return c.json(expenses)
    }
    catch(error){
        console.error(error);
        return c.status(500);
    }
})