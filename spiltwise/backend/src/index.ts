import { Hono } from 'hono'
import {signup , signin,users} from './routes/sign'
import { createGroup ,userinGroup,setUserInGroup} from './routes/group'
import { addExpense,deleteExpense,unequalExpense } from './routes/expense'
import { cors } from 'hono/cors'
const app = new Hono<{
    Bindings:{
        DATABASE_URL:String
    }
}>()
app.use('*',cors());
app.route('api/v1/user', signin)
app.route('api/v1/user', signup)
app.route('/api/v1/users',users)
app.route('api/v1/group',createGroup)
app.route('api/v1/group',addExpense)
app.route('api/v1/group',userinGroup)
app.route('/api/v1/group',setUserInGroup)
app.route('/api/v1/',deleteExpense)
app.route('/api/v1/',unequalExpense)
export default app
