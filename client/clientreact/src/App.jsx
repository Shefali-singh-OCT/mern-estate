import { BrowserRouter,Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"
import Profile from "./pages/Profile"
import About from "./pages/About"
import Header from "./components/Header"
import Privateroute from "./components/Privateroute"
import CreateListing from "./pages/CreateListing"

function App() {

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<Signup />} />
        <Route element={<Privateroute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/createlisting" element={<CreateListing />} />
        </Route>
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
