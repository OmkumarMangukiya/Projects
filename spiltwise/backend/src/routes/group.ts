import { Hono } from "hono";
import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
import { JSONArray ,JSONObject,JSONPrimitive} from "hono/utils/types";
// type InputJsonValue = JSONArray | JSONObject | JSONPrimitive | null |undefined;
const app = new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:SignatureKey
    }
}>()
export const createGroup = app.post('/create',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    const body = await c.req.json();
    const group = await prisma.group.create({
        data: {
            Name : body.name,
            TotalSpent : 0
        }
    })
    return c.json({msg:"group created succefully" , group})
})
export const addExpense = app.post('/addexpense',async (c)=>{
    const prisma = new PrismaClient({
       datasourceUrl : c.env?.DATABASE_URL 
    })

    const body:{
        // id : string, 
        username : string,
        Name : string,
        Total : number,
        DivideTo : string[],
        groupId : string 
    } = await c.req.json();
    const user = await prisma.user.findUnique({
        where:{
            // id : body.id,
            username : body.username || ""
        }
    } )
    
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
    if(user){
        user.MoneyLent = user.MoneyLent + (expense.Total*9)/10 }

    const all = await prisma.user.findMany({
        where: {
            username: { in: expense.DivideTo as string[] ?? [] }
        }
    })
    let x=false;
    for(const element of all){
        if(element.id != user?.id){
            const name = await prisma.user.findUnique({
                where : {id : element.id},
                select : {oweTo:true}
            }) ;
            
            const updateOweto = [
                ...(Array.isArray(name?.oweTo) ? name?.oweTo : []),
                {user : user?.username , value:expense.Total/all.length}] as Array<any>;
            console.log(name)
        const ele = await prisma.user.update({
            where:{
                id : element.id,
            },
            data:{
                MoneyOwe: { increment : expense.Total/(all.length )},
                oweTo : updateOweto
            }
        })}
        else{
            x = true;
        }
        
    }
    
    const updatedlenTo: Array<any> = [
        ...(Array.isArray(user?.lendTo) ? user.lendTo : []),
        ...all.map(element => ({
            user: element?.username,
            value: expense.Total / all.length
        }))
    ];
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

export const openGroup = app.get('/opengroup',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL 
     })
     try{
        const groups = await prisma.group.findMany();
        return c.json(groups);
     }
     catch(error){
        console.error(error);
        return c.status(500);
     }
})

export const getGroupById = app.get('/opengroup/:id',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    })
    const groupId = c.req.param('id');
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
        return c.json(expenses)
    }
    catch(error){
        console.error(error);
        return c.status(500);
    }
})