import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/utils/jwt/jwt";
import { SignatureKey } from "hono/utils/jwt/jws";
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
        id : string,
        username : string,
        Name : string,
        Total : number,
        DivideTo : string[] 
    } = await c.req.json();
    const user = await prisma.user.findUnique({
        where:{
            id : body.id,
            username : body.username || ""
        }
    })
    
    const expense = await prisma.expense.create({
        data:{
            Name : body.Name,
            createdBy : user?.username || "",
            Total : body.Total,
            DivideTo : body.DivideTo
        }
    })
    if(user){
        user.MoneyLent = user.MoneyLent + (expense.Total*9)/10 }

    const all = await prisma.user.findMany({
        where: {
            username: { in: expense.DivideTo as string[] ?? [] }
        }
    })
    all.forEach(element => {
        if(element.username != user?.username){
        element.MoneyOwe += (expense.Total)/(all.length -1)
        }
        console.log(element)
    });
    
    return c.json({msg:"expense created succesfully",all})
})