import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    imagesUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 50,
    offer: false,
    parkings: false,
    furnished: false,
    userRef: currentUser._id,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [upload, setUploading] = useState(false);
  const navigate = useNavigate();
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imagesUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promise = [];
      for (let i = 0; i < files.length; i++) {
        promise.push(storeImage(files[i]));
      }
      Promise.all(promise)
        .then((urls) => {
          setFormData({
            ...formData,
            imagesUrls: formData.imagesUrls.concat(urls),
          });
        })
        .then(() => {
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
  const handleremoveimage = (index) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this picture??"
    );
    if (confirmed) {
      setFormData({
        ...formData,
        imagesUrls: formData.imagesUrls.filter((_, i) => i !== index),
      });
    }
  };
  const handlesubmit = async (e) => {
    e.preventDefault();
    setImageUploadError(false)
    try {
      if (formData.imagesUrls.length < 1) {
        return setError("You must upload atleast one image");
      }
      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price");
      }
      setLoading(true);
      setError(false);
      const res = await fetch("http://localhost:3000/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      console.log("Hey i am just going to parse data")
      const data = await res.json();
      console.log("Just parsed")
      setLoading(false);
      if (data.success == false) {
        setError(data.message);
        return;
      }
      console.log("hey your data is been converted into json successfully: ",data)
      navigate(`/lisitng/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }
    if (
      e.target.id === "parkings" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  const MyComponent = () => {
    return (
      <div className="flex items-center gap-2">
        <input
          className="px-1 py-3 border border-gray-300 rounded-lg"
          type="number"
          id="discountPrice"
          min="0"
          max="100000"
          defaultValue="1"
          required
          onChange={handleChange}
          value={formData.discountPrice}
        />
        <div className="flex flex-col items-center">
          <span>Discounted price</span>
          <span className="text-xs">($/month)</span>
        </div>
      </div>
    );
  };
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">
        Create a Listing
      </h1>
      <form onSubmit={handlesubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            defaultValue={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            defaultValue={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            defaultValue={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5 "
                onChange={handleChange}
                checked={formData.type === "sale"}
              />{" "}
              <span> Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5 "
                onChange={handleChange}
                checked={formData.type === "rent"}
              />{" "}
              <span> Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parkings"
                className="w-5 "
                onChange={handleChange}
                checked={formData.parkings}
              />{" "}
              <span> Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5 "
                onChange={handleChange}
                checked={formData.furnished}
              />{" "}
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5 "
                onChange={handleChange}
                checked={formData.offer}
              />{" "}
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-7">
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                defaultValue="1"
                required
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <span>Beds</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="bathrooms"
                min="1"
                max="5"
                defaultValue="1"
                required
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <span>Baths</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="px-1 py-3 border border-gray-300 rounded-lg"
                type="number"
                id="regularPrice"
                min="50"
                max="100000"
                defaultValue="1"
                required
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <span>Regular price</span>
                <span className="text-xs">($/month)</span>
              </div>
            </div>

            {formData.offer ? <MyComponent /> : ""}
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
              disabled={upload}
              onClick={handleImageSubmit}
              className="p-3 text-green-700  border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-70"
            >
              {upload ? "uploading..." : "upload"}
            </button>
          </div>

          <p className="text-red-700 mt-2">
            {imageUploadError ? imageUploadError : ""}
          </p>
          {formData.imagesUrls.length > 0
            ? formData.imagesUrls.map((urls, index) => (
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
              ))
            : ""}
          <button
            disabled={loading || upload}
            className="p-3 mt-6 bg-slate-700 text-white rounded-lg  uppercase hover:opacity-90 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
