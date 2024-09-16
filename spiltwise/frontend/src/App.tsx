import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import Groups from './pages/Groups'
import CreateGroup from './pages/CreateGroup'
import AddExpense from './pages/AddExpense'
import Group from './pages/Group'
import './App.css'
function App() {

  return (
    <>
      
      <BrowserRouter>
      <Routes >
        <Route path='/signin' Component={Signin} ></Route>
        <Route path='/signup' Component={Signup} ></Route>
        <Route path='/groups' Component={Groups}></Route>
        <Route path='/creategroup' Component={CreateGroup}></Route>
        <Route path='/addexpense' Component={AddExpense}></Route>
        <Route path='group' Component={Group} ></Route>
      </Routes>
      </BrowserRouter>

          </>
  )
}

export default App
