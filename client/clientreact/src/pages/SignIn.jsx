import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInSuccess, singInStart,initialStart } from "../redux/user/userSlice.js";
import Oath from "../components/oath.jsx";

function Signin() {
  const [formdata, setformdata] = useState({});
  const { loading, error} = useSelector(state => state.user)
 const dispatch = useDispatch()
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(initialStart());
  }, []);
  const handleChange = (id, value) => {
    setformdata((prevData) => ({
      ...prevData,
      [id]: value, // Use 'id' as the key and store 'value' as the updated value
    }));
  };
  const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(singInStart())
    try {
      const res = await fetch("http://localhost:3000/api/auth/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json", // Ensure this header is set
        },
        credentials: "include",
        body: JSON.stringify(formdata),
      });
      const data = await res.json();
      if (data.success === false) {
         dispatch(signInFailure(data.message))
        return;
      }
       dispatch(signInSuccess(data))
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 ">
        <input
          type="text"
          placeholder="email"
          onChange={(e) => {
            handleChange("email", e.target.value);
          }}
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          onChange={(e) => {
            handleChange("password", e.target.value);
          }}
          className="border p-3 rounded-lg"
          id="password"
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>
        <Oath/>
      </form>
      <div className="flex gap-2 mt-5">
        <p> Dont have an account</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}

export default Signin;
