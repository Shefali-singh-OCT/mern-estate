import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

// Initialize Swiper with Navigation
function Home() {
  SwiperCore.use([Navigation]);
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);
  const [error, setError] = useState(null);
 useEffect(() => {
   const fetchOfferListings = async () => {
     try {
       const res = await fetch(
         "http://localhost:3000/api/listing/get?offer=true&limit=4"
       );
       if (!res.ok) throw new Error("Failed to fetch offer listings");
       const data = await res.json();
       setOfferListing(data);
       fetchRentListings(); // Make sure this function is properly called next
     } catch (error) {
       setError(error.message);
     }
   };

   const fetchRentListings = async () => {
     try {
       const res = await fetch(
         "http://localhost:3000/api/listing/get?type=rent&limit=4"
       );
       if (!res.ok) throw new Error("Failed to fetch rent listings");
       const data = await res.json();
       setRentListing(data);
       fetchSaleListings(); // Ensure the next function is called correctly
     } catch (error) {
       setError(error.message);
     }
   };

   const fetchSaleListings = async () => {
     try {
       const res = await fetch(
         "http://localhost:3000/api/listing/get?type=sale&limit=4"
       );
       if (!res.ok) throw new Error("Failed to fetch sale listings");
       const data = await res.json();
       setSaleListing(data);
     } catch (error) {
       setError(error.message);
     }
   };

   // Fetch listings on mount
   fetchOfferListings();
 }, []);


  return (
    <div className="px-3">
      {/* Top Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Discover the <span className="text-slate-500">home</span> of your
          dreams <br /> with simplicity and style
        </h1>
        <div className="text-xs sm:text-sm text-gray-500">
          Shefali Estate is where your <span>dream home</span> becomes a
          reality. <br /> Discover an extensive selection of properties tailored
          just for you.
        </div>
        <Link
          to={"/search"}
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper for Offers */}
      <Swiper navigation
      >
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              {listing.imagesUrls && listing.imagesUrls.length > 0 && (
                <div
                  style={{
                    background: `url(${listing.imagesUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                ></div>
              )}
            </SwiperSlide>
          ))}
      </Swiper>

      {/* Listing Results for Offers, Sale, and Rent */}
      <div className="max-w-6xl mx-auto flex flex-col gap-8 my-10">
        {offerListing && offerListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {offerListing.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {rentListing && rentListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for rent
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=rent"}
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {rentListing.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}

        {saleListing && saleListing.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-2xl font-semibold text-slate-600">
                Recent places for sale
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?type=sale"}
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4">
              {saleListing.map((listing) => (
                <ListingCard listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
