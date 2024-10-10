import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import Contact from "../components/Contact";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hover,SetHover] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact,setContact] = useState(false)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const listingId = params.listingId;
        const response = await fetch(
          `http://localhost:3000/api/listing/getListing/${listingId}`
        );
        const data = await response.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setLoading(false);
        setListing(data);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, []);
  return (
    <div>
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-black"></div>
        </div>
      )}
      {listing && !loading && !error && (
        <>
          <Swiper navigation>
            {listing.imagesUrls.map((url, index) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[550px]"
                  style={{
                    background: `url(${url}) center no-repeat`,
                    backgroundSize: "cover",
                    backgroundFit: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="mx-6  mb-6 cursor-pointer">
            <div className="flex mx-6 sm:m-auto max-w-5xl flex-col gap-5 mt-5 mb-5">
              <div className="text-2xl mt-5 sm:text-3xl ml-3 font-semibold">
                {listing.name} - ${listing.regularPrice}
                {listing.type === "rent" ? "/month" : ""}
              </div>

              <p className="flex items-center gap-2 text-slate-700 text-sm">
                <FaMapMarkerAlt className="text-green-800 text-2xl" />{" "}
                <span>{listing.address}</span>
              </p>
              <div className="flex gap-4">
                <p className="bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md">
                  {listing.type === "rent" ? "For Rent" : "For sale"}
                </p>
                {listing.offer && (
                  <p
                    onMouseEnter={() => SetHover(true)}
                    onMouseLeave={() => SetHover(false)}
                    className="bg-green-900 w-full max-w-[200px] text-white text-center  rounded-md"
                  >
                    ${+listing.regularPrice - +listing.discountPrice}
                  </p>
                )}
              </div>
              {hover && (
                <p className="text-orange-700">
                  This is total price you have to pay after applying all the
                  discount
                </p>
              )}
              <p className=" text-slate-800">
                {" "}
                <span className="font-semibold text-black">
                  Description
                </span> - {listing.description}
              </p>
              <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaBed className="text-lg text-black" />{" "}
                  {listing.bedrooms > 1
                    ? `${listing.bedrooms} beds`
                    : `${listing.bedrooms} bed`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaBath className="text-lg text-black" />{" "}
                  {listing.bathrooms > 1
                    ? `${listing.bathrooms} baths`
                    : `${listing.bathrooms} bath`}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaParking className="text-lg text-black" />{" "}
                  {listing.parking ? "Parking spot" : "No Parking"}
                </li>
                <li className="flex items-center gap-2 whitespace-nowrap ">
                  <FaChair className="text-lg text-black" />{" "}
                  {listing.furnished ? "Furnished" : "unfurnished"}
                </li>
              </ul>
              {currentUser && listing.userRef === currentUser._id && !contact &&(
                <button onClick={()=>setContact(true)} className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-85">
                  Contact landlord
                </button>
              )}
              {contact && <Contact list = {listing}/>}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
