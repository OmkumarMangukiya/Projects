
import {  verify } from 'hono/jwt'

//MIDDLEWARE
export function middleware(app : any){
    app.use('/api/v1/blog/*', async (c:any, next:any) => {
        const token = c.req.header('Authorization');
        if (!token) {
          return c.json({ message: 'No token found' })
        }
        const tokenFinal = token.split(' ')[1]
        const verified = await verify(tokenFinal, c.env.JWT_SECRET)
        if(!verified) 
        return c.json({ message: 'Token is not valid' })
      await next()
      })}
