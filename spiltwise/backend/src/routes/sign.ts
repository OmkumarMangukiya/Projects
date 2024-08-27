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
export const signup = app.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
    const body = await c.req.json();
    try{
        const user = await prisma.user.create({
            data:{
                email : body.email,
                username : body.username,
                password : body.password,
                MoneyOwe: 0,
                MoneyLent: 0,
                lendTo: [],
                oweTo: []
            }
        })
   
    const token = await sign({username:user.username},c.env.JWT_SECRET) 
    return c.json({msg:"Signup Completed" , token , username : user.username}) 
}
catch(e){
return c.status(403);
}

     
})

export const signin = app.post('/signin',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
        
            const body =await c.req.json();
            const user = await prisma.user.findUnique({
                where:{
                    id: body.id, // Provide the id property here
                    username : body.username,
                    password : body.password
                }
            })
         if(!user){
                c.status(403);
                return c.json({msg:"user not found"})

            }
            const token = await sign({username : user?.username},c.env.JWT_SECRET);
            return c.json({msg:"signin comppleted ",token,username : user.username})
})