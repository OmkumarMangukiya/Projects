import { BrowserRouter,Route,Routes } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
import Groups from './pages/Groups'
import './App.css'
function App() {

  return (
    <>
      
      <BrowserRouter>
      <Routes >
        <Route path='/' Component={Signin} ></Route>
        <Route path='/signup' Component={Signup} ></Route>
        <Route path='/groups' Component={Groups}></Route>
      </Routes>
      </BrowserRouter>

          </>
  )
}

export default App
