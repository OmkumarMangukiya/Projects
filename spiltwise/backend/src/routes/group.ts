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
    const token: string | undefined = await c.req.header('token')?.split(' ')[1];
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

    const userId =  (decoded as any)?.userId as string;
    if (!userId) {
        console.log("User ID not found in token");
        return c.json({ msg: "User ID not found in token" ,decoded});
    }

    try {
        const group = await prisma.group.create({
            data: {
                Name: body.name,
                authorId: userId,
                TotalSpent: 0, 
                groupToUser: {
                    create: {
                        userId: userId,
                    }
                }
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
            // where: {
            //     authorId: userId,
            // }
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
export const userinGroup = app.get('/users', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c?.env.DATABASE_URL
        }).$extends(withAccelerate());
        const groupId =  c.req.header('groupid');
        if (!groupId) {
            return c.json({ error: 'Group ID not found' });
        }
        const users = await prisma.user.findMany({
           where:{
            groupToUser:{
                some: {
                    groupId: groupId
                }
            }
           }
        });

        console.log(users);
        return c.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        c.status(500);
        return c.json({ error: 'Internal Server Error is there' });
    }
});

export const setUserInGroup = app.post(`/:id/:userId`,async(c)=>{
    const prisma = new PrismaClient({
        datasourceUrl: c?.env.DATABASE_URL
    }).$extends(withAccelerate())
    const { id, userId } = c.req.param();
    console.log(id,userId)
    try {
        // Check if the user is already in the group
        const existingRelation = await prisma.groupToUser.findFirst({
            where: {
                groupId: id,
                userId: userId
            }
        });

        if (existingRelation) {
            return c.json({ msg: "User already exists in the group" });
        }

        // Add the user to the group
        const group = await prisma.group.update({
            where: {
                id: id,
            },
            data: {
                groupToUser: {
                    create: {
                        userId: userId,
                    }
                }
            }
        });

        return c.json({ msg: "User added to group successfully", group });
    }
    catch{
        c.status(500)
        return c.json({error: 'Internal Server Error Happened'})
    }
})