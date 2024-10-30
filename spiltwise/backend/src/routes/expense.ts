import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { JSONArray ,JSONObject,JSONPrimitive} from "hono/utils/types";
import { verify } from "hono/utils/jwt/jwt";
import { JWTPayload } from "hono/utils/jwt/types";
import { toASCII } from "punycode";
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
    const updatedDivideTo: { [key: string]: number } = {};
    body.DivideTo.map((ele)=>{
        updatedDivideTo[ele] = ((body.Total )/ (body.DivideTo.length))
    })
    const expense = await prisma.expense.create({
        data:{
            Name : body.Name,
            createdBy : user?.username || "",
            Total : body.Total,
            DivideTo : updatedDivideTo,
            authorId : user?.id,
            groupId : body.groupId,
            Owes : [],
            Lent:  []
        }
    })
    if (user) {
        user.MoneyLent = user.MoneyLent + (expense.Total * 9) / 10
    }
    console.log('error')
    const all = await prisma.user.findMany({
        where: {
            username: { in: body.DivideTo as string[] }
        }
    })
    // console.log('not ')
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

export const unequalExpense = app.post('/unequalexpense',async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl:c.env?.DATABASE_URL
    }).$extends(withAccelerate());
    const body = await c.req.json();
    const DivideTo = (body.userArr)
    const name = body.name;
    const Total = body.Total;
    const groupid = c.req.header('groupId');
    const token = c.req.header('token');
    
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
    const expense = await prisma.expense.create({
        data:{
            Name : name,
            createdBy : user?.username || "",
            Total : Total,
            DivideTo : DivideTo,
            authorId : user?.id,
            groupId : groupid,
            Owes : [],
            Lent:  []
        }
    })
    // Check if the user already exists in DivideTo
    // const DivideTo: { [key: string]: number } = {};
    // DivideTo.forEach((ele: { user: string, value: number }) => {
    //     DivideTo[ele.user] = ele.value;
    // });

    const all = await prisma.user.findMany({
        where: {
            username: { in: Object.keys(DivideTo) }
        }
    });

    let checkifUser = false;
    for (const element of all) {
        if (element.id !== user?.id) {
            const name = await prisma.user.findUnique({
                where: { id: element.id },
                select: { oweTo: true }
            });

            let updateOweto = Array.isArray(name?.oweTo) ? name?.oweTo : [] as Array<any>;

            // Check if user.username already exists in oweTo array
            const existingEntryIndex = updateOweto.findIndex((entry: any) => entry.user === user?.username);
            if (existingEntryIndex !== -1) {
                // Update the existing entry's value
                updateOweto[existingEntryIndex].value += DivideTo[element.username];
            } else {
                // Add a new entry
                updateOweto.push({ user: user?.username, value: DivideTo[element.username] });
            }

            if (!expense.Lent) { expense.Lent = []; }
            if (!Array.isArray(expense.Lent)) {
                expense.Lent = [];
            }

            expense.Lent.push({ user: user?.username || "", value: DivideTo[element.username] });

            await prisma.user.update({
                where: {
                    id: element.id,
                },
                data: {
                    MoneyOwe: { increment: DivideTo[element.username] },
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
            updatedlenTo[existingEntryIndex].value += DivideTo[element.username];
        } else {
            // Add a new entry
            updatedlenTo.push({
                user: element?.username,
                value: DivideTo[element.username]
            });
        }

        if (!expense.Owes) { expense.Owes = []; }
        if (!Array.isArray(expense.Owes)) {
            expense.Owes = [];
        }
        expense.Owes.push({ user: element?.username, value: DivideTo[element.username] });
    });

    await prisma.user.update({
        where: {
            id: user?.id,
        },
        data: {
            MoneyLent: { increment: checkifUser && user?.username ? (Total - DivideTo[user.username]) : Total },
            lendTo: updatedlenTo
        }
    });

    await prisma.group.update({
        where: {
            id: groupid,
        },
        data: {
            TotalSpent: {
                increment: Total
            }
        }
    });

    return c.json({ msg: "Unequal expense created successfully", all });
})

export const deleteExpense = app.post('/deleteexpense', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate());

    const body: {
        expenseId: string;
    } = await c.req.json();

    const token: string | undefined = c.req.header('Authorization')?.split(' ')[1];
    if (!token) {
        return c.json({ msg: "No token provided", token });
    }

    let decoded;
    try {
        decoded = await verify(token, c.env.JWT_SECRET);
    } catch (error) {
        console.log("Token verification failed:", error);
        return c.json({ msg: "Token verification failed" });
    }

    const user = await prisma.user.findUnique({
        where: {
            username: (decoded as { username: string }).username
        }
    });

    if (!user) {
        return c.json({ msg: "User not found" });
    }

    const expense = await prisma.expense.findUnique({
        where: {
            id: body.expenseId
        }
    });

    if (!expense) {
        return c.json({ msg: "Expense not found" });
    }

    if (expense.authorId !== user.id) {
        return c.json({ msg: "User is not authorized to delete this expense" });
    }

    await prisma.expense.delete({
        where: {
            id: body.expenseId
        }
    });

    const updatedUsers = await prisma.user.findMany({
        where: {
            username: { in: Object.keys(expense.DivideTo as { [key: string]: number }) }
        }
    });

    for (const element of updatedUsers) {
        const updatedOweTo = (element.oweTo as Array<any>).filter((entry: any) => entry.user !== user.username);
        await prisma.user.update({
            where: {
                id: element.id
            },
            data: {
                MoneyOwe: { decrement: (expense.DivideTo as { [key: string]: number })[element.username] },
                oweTo: updatedOweTo
            }
        });
    }

    const updatedLendTo = (user.lendTo as Array<any>).filter((entry: any) => !Object.keys(expense.DivideTo as { [key: string]: number }).includes(entry.user));
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            MoneyLent: { decrement: expense.Total },
            lendTo: updatedLendTo
        }
    });

    await prisma.group.update({
        where: {
            id: expense.groupId
        },
        data: {
            TotalSpent: {
                decrement: expense.Total
            }
        }
    });

    return c.json({ msg: "Expense deleted successfully" });
})