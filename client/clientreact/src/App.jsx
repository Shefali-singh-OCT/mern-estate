import { BrowserRouter,Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import Signout from "./pages/Signout"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Header from "./components/header"

function App() {

  return (

    <BrowserRouter>
    <Header/>
     <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/sign-in" element={<SignIn/>}/>
      <Route path="/sign-up" element={<Signout/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/about" element={<About/>}/>
     </Routes>
    </BrowserRouter>
  )
}

export default App
