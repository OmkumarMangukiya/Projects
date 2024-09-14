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
   
    const token:any = await sign({userId:user.id},c.env.JWT_SECRET);
    // const cookie = serialize('authToken',token,{
    //     httpOnly: true, // Makes the cookie inaccessible to JavaScript on the client-side
    //         secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    //         maxAge: 60 * 60 * 24 * 7, // 1 week
    //         path: '/'
    // })
    c.res.headers.set('Set-Cookie', `token=${token}; HttpOnly`);
    return c.json({msg:"Signup Completed" , token , id : user.id}) 
}
catch(e){
return c.json({error:"Error"});
}

     
})

export const signin = app.post('/signin',async (c)=>{
    const prisma = new PrismaClient({
        datasourceUrl : c.env?.DATABASE_URL
    }).$extends(withAccelerate())
    
        
            const body =await c.req.json();
            const user = await prisma.user.findUnique({
                where:{
                    
                    username : body.username,
                    password : body.password
                }
            })
         if(!user){
                c.status(403);
                return c.json({msg:"user not found"})

            }
            const token = await sign({id : user?.id},c.env.JWT_SECRET);
            c.res.headers.set('Authorization', `Bearer ${token}`);
            
            c.res.headers.set('Set-Cookie', `token=${token}; HttpOnly; Secure`);
            return c.json({msg:"signin comppleted ",token,username : user.username})
})