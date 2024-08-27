import { Hono } from 'hono'
import {signup , signin} from './routes/sign'
import { createGroup,addExpense } from './routes/group'
const app = new Hono<{
    Bindings:{
        DATABASE_URL:String
    }
}>()
app.route('api/v1/user', signin)
app.route('api/v1/user', signup)
app.route('api/v1/group',createGroup)
app.route('api/v1/group',addExpense)

export default app
