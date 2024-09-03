import { Hono } from 'hono'
import {signup , signin} from './routes/sign'
import { createGroup,addExpense } from './routes/group'
import { cors } from 'hono/cors'
const app = new Hono<{
    Bindings:{
        DATABASE_URL:String
    }
}>()
app.use('*',cors());
app.route('api/v1/user', signin)
app.route('api/v1/user', signup)
app.route('api/v1/group',createGroup)
app.route('api/v1/group',addExpense)

export default app
