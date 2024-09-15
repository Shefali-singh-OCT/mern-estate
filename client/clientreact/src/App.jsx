import { BrowserRouter,Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"
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
      <Route path="/sign-up" element={<Signup/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/about" element={<About/>}/>
     </Routes>
    </BrowserRouter>
  )
}

export default App
