import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
  deleteUserFailure,
  deleteUserStart,
  defaultsetting,
  deleteUserSuccess,
  signoutUserSuccess,
  signoutUserFailure,
  signoutUserStart,
  initialStart,
} from "../redux/user/userslice.js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Profile() {
  const fileref = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePrec] = useState(0);
  const [fileUploadError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    setUpdateSuccess(false);
  }, []);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const filename = new Date().getTime() + file.name;
    const storageRef = ref(storage, filename);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePrec(Math.round(progress));
      },
      (error) => {
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(
        `http://localhost:3000/api/user/update/${currentUser._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };
  const handledeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undo."
    );
    if (confirmed) {
      try {
        dispatch(deleteUserStart());
        const response = await fetch(
          `http://localhost:3000/api/user/delete/${currentUser._id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message));
          return;
        }
        dispatch(deleteUserSuccess());
        navigate("/sign-in");
      } catch (error) {
        dispatch(deleteUserFailure(error.message));
      }
    }
  };
  const handlesignout = async () => {
    try {
      dispatch(signoutUserStart());
      const res = await fetch("http://localhost:3000/api/user/signout", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      //console.log(data);
      if (data.success === false) {
        dispatch(signoutUserFailure(data.message));
        return;
      }
      dispatch(signoutUserSuccess());
      navigate("/sign-in");
    } catch (error) {
      dispatch(signoutUserFailure(message.message));
    }
  };
  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(
        `http://localhost:3000/api/user/listing/${currentUser._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include"
        }
      );
      
      const data = await res.json();
      if (data.success == false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  // useEffect(() => {
  //   console.log("Updated userListing:", userListing);
  // }, [userListing]);
  const handleListingDelete = async (id,index) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/listing/deleteListing/${id}/${index}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      if(data.imagesUrls.length > 0){
        setUserListing(data);
        return;
      }
      setUserListing((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      setShowListingError(error.message)
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileref}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileref.current.click()}
          src={formData?.avatar || currentUser?.avatar}
          alt="avatar"
          className="rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center my-4"
        />
        <p className="test-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">
              Error image upload (image must be less then 2mb)
            </span>
          ) : filepercentage > 0 && filepercentage < 100 ? (
            <span className="text-slate-700">{`Uploading ${filepercentage}`}</span>
          ) : filepercentage === 100 ? (
            <span className="text-green-700">
              {" "}
              Image successfully uploaded{" "}
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
          id="username"
          className="borser p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          onChange={handleChange}
          defaultValue={currentUser.email}
          className="borser p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          onChange={handleChange}
          id="password"
          className="borser p-3 rounded-lg"
        />
        <button
          disabled={loading}
          onClick={handleSubmit}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Update"}
        </button>
        <Link
          to={"/createListing"}
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-90"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-4">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handledeleteAccount}
        >
          Delete Account
        </span>
        <span className="text-green-700 cursor-pointer" onClick={handlesignout}>
          Sign out
        </span>
      </div>
      <button
        onClick={handleShowListing}
        className="text-green-700 mt-3 font-semibold w-full"
      >
        Show Listings
      </button>

      <p className="text-red-700 font-semibold text-center">
        {showListingError ? "Error showing listing" : ""}
      </p>
      <p className="text-red-700 mt-5 text-center">{error ? error : ""}</p>
      <p className="text-green-700 text-center">
        {updateSuccess ? "User is updated successfully!" : ""}
      </p>

      {userListing && userListing.length > 0 ? (
        <h1 className="text-center mt-7 text-2xl font-semibold">
          Your Listing
        </h1>
      ) : (
        ""
      )}

      {userListing &&
        userListing.length > 0 &&
        userListing.map((user) =>
          user.imagesUrls.map((url, index) => (
            <div
              key={`${user._id}-${index}`}
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
            >
              <div className="bg-red-400 h-32 w-45"></div>
              <Link to={`/listing/${user._id}`}>
                <img
                  src={url}
                  alt="listing image"
                  className="h-16 w-16 object-contain"
                />
              </Link>
              <Link
                className="text-state-800 font-semibold flex-1 hover:underline truncate"
                to={`/listing/${user._id}`}
              >
                <p>{user.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(user._id,index)} // Fix: Use arrow function
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <button className="text-green-700 uppercase">Edit</button>
              </div>
            </div>
          ))
        )}
    </div>
  );
}

export default Profile;
