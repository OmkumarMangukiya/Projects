import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import {middleware}  from '../middleware'

export const blogRouter = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string,
  }
  Variables: {
    userId: string
}

}>()
middleware(blogRouter)

blogRouter.post('/create' , async (c)=>{
    const body = await c.req.json();
    console.log(body)
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL
    }).$extends(withAccelerate())

    const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: body.authorId,
            pusblished: true
    }
    });
    return c.json({message: 'Blog Created',post})

  })
  
  blogRouter.put('/update' , async(c)=>{
    const body = await c.req.json();
    const userId = body.userId;

    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: c.env?.DATABASE_URL
        }
      }
    }).$extends(withAccelerate())

    const post = await prisma.post.update({
        where: {id: body.id , authorId: userId}  ,
        data: {
            title: body.title,
            content: body.content,
            
    }
    });
    
    return c.json({message: 'Blog Updated', id: post.id});
  })
  blogRouter.get('/bulk' , async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    })
      try{
        const blogs = await prisma.post.findMany();
        return c.json(blogs)
      }
      catch(e){
        return c.json({message: 'No Blogs Found'})
      }
  })
  blogRouter.get('/:id' , async (c)=>{ 
      const prisma = new PrismaClient({
          datasourceUrl: c.env?.DATABASE_URL
      }).$extends(withAccelerate())
  
      const blogId = c.req.param('id');
      console.log(blogId)
      const blog = await prisma.post.findFirst({
          where: { id: blogId }
      });
      console.log(blog)
      if (!blog) {
          return c.json({ message: 'Blog not found' }, 404);
      }
  
      return c.json(blog);
  })
  
  