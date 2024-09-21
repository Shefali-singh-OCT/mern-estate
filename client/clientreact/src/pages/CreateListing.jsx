import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageURLS: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [upload,setUploading] = useState(false)
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageURLS.length < 7) {
      setUploading(true)
      setImageUploadError(false);
      const promise = [];
      for (let i = 0; i < files.length; i++) {
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise)
        .then((urls) => {
          setFormData({
            ...formData,
            imageURLS: formData.imageURLS.concat(urls),
          });
        }).then(()=>{
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed (2 mb max image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
    }
  };
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const storageRef = ref(storage, filename);
      const uplaodTask = uploadBytesResumable(storageRef, file);
      uplaodTask.on(
        "state-changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uplaodTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  const handleremoveimage = (index)=>{
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if(confirmed){
    setFormData({
      ...formData,
      imageURLS: formData.imageURLS.filter((_, i) => i !== index),
    });
    }
      
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5 " />{" "}
              <span> Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5 " />{" "}
              <span> Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking spot" className="w-5 " />{" "}
              <span> Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5 " />{" "}
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5 " />{" "}
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-7">
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedroom"
                min="1"
                max="10"
                defaultValue="1"
                required
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathroom"
                min="1"
                max="5"
                defaultValue="1"
                required
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                defaultValue="1"
                required
              />
              <div className="flex flex-col items-center">
                <span>Regular price</span>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                defaultValue="1"
                required
              />
              <div className="flex flex-col items-center">
                <span>Discounted price</span>
                <span className="text-xs">($/month)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1">
          <p className="font-semibold">
            Images :
            <span className="font-normal text-gray-700 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4 mt-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled= {upload}
              onClick={handleImageSubmit}
              className="p-3 text-green-700  border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-70"
            >
              {upload ? 'uploading...' : 'upload'}
            </button>
          </div>

          <p className="text-red-700 mt-2">
            {imageUploadError ? imageUploadError : ""}
          </p>
          {formData.imageURLS.length > 0 ?
           ( formData.imageURLS.map((urls, index) => (
              <div
                key={urls}
                className="flex justify-between p-3 border items-center"
              >
                <img
                  src={urls}
                  alt="listing image"
                  className="w-20 h-20 object-contain rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleremoveimage(index)}
                  className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                >
                  Delete
                </button>
              </div>
            ))) : ""}
          <button className="p-3 mt-6 bg-slate-700 text-white rounded-lg  uppercase hover:opacity-90 disabled:opacity-80">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
