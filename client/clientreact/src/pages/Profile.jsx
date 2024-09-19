import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

function Profile() {
  const fileref = useRef(null);
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filepercentage, setFilePrec] = useState(0);
  const [fileUploadError, setFileError] = useState(false);
  const [formData, setFormData] = useState({});
  console.log(formData)
  console.log(filepercentage);
  console.log(fileUploadError)

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
    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold my-7 text-center">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileref}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileref.current.click()}
          src={ formData.avatar || currentUser.avatar}
          alt="avatar"
          className="rounded-full h-24 w-24 object-cover hover:cursor-pointer self-center my-4"
        />
        <p className="test-sm self-center">
          {fileUploadError ? <span className="text-red-700">Error image upload (image must be less then 2mb)</span> : filepercentage>0 && filepercentage<100 ? <span className="text-slate-700">{`Uploading ${filepercentage}`}</span> : filepercentage===100 ? <span className="text-green-700"> Image successfully uploaded </span>: "" }
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          className="borser p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="email"
          id="email"
          className="borser p-3 rounded-lg"
        />
        <input
          type="text"
          placeholder="password"
          id="password"
          className="borser p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80">
          update
        </button>
      </form>
      <div className="flex justify-between mt-4">
        <span className="text-red-700 cursor-pointer ">Delete Account</span>
        <span className="text-green-700 cursor-pointer ">Sign out</span>
      </div>
    </div>
  );
}

export default Profile;
