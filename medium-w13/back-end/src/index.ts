import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import bcrypt from 'bcrypt'
import { middleware } from './middleware'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>()
app.use(cors())
app.use(async (c, next) => {
  c.res.headers.set("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept, authorization");
  await next();
});

app.use(async (c, next) => {
  c.res.headers.set("Access-Control-Allow-Origin", "*");
  await next();
});

middleware(app)
app.route('/api/v1/user', userRouter)
app.route('/api/v1/blog', blogRouter)

export default app