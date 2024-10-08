import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

function Oath() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); 
      const auth = getAuth(app)
      const result = await signInWithPopup(auth,provider)
      const res = await fetch("http://localhost:3000/api/auth/google",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
      });
      const data = await res.json()
      dispatch(signInSuccess(data))
      navigate("/")
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg uppercase haver:opacity-9"
    >
      continue with google{" "}
    </button>
  );
}

export default Oath;
