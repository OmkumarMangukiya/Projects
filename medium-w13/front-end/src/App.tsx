import './App.css'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import CreateBlog from './pages/CreateBlog'
import BulkBlog from './pages/BulkBlog'
import GetBlog from './pages/GetBlog'
import { BrowserRouter , Route, Routes } from 'react-router-dom'
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup/>} />
          <Route path='/signin' element={<Signin/>}></Route>
          <Route path='/createblog' element={<CreateBlog/>}></Route>
          <Route path='/bulkblog' element={<BulkBlog/>}></Route>
          <Route path='/getblog' element={<GetBlog/>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
