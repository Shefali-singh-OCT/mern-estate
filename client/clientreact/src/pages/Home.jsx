import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react"; // Correct import for Swiper and SwiperSlide
import "swiper/css"; // Import Swiper styles
import "swiper/css/navigation"; // Import Navigation styles
import { Navigation } from "swiper/modules";// Correct import for Navigation module
import Listing from "./Listing";

// Initialize Swiper with Navigation
function Home() {
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
        const data = await res.json();
        setOfferListing(data);
        fetchRentListings();
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchRentListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/listing/get?type=rent&limit=4"
        );
        const data = await res.json();
        setRentListing(data);
        fetchSaleListings();
      } catch (error) {
        setError(error.message);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/api/listing/get?type=sale&limit=4"
        );
        const data = await res.json();
        setSaleListing(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchOfferListings();
  }, []);

  return (
    <div>
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
      <Swiper navigation modules={[Navigation]}>
        {offerListing &&
          offerListing.length > 0 &&
          offerListing.map((listing) => (
            <SwiperSlide key={listing._id}>
              {listing.imageUrls && listing.imageUrls.length > 0 ? (
                <div
                  style={{
                    background: `url(${listing.imageUrls[0]}) center no-repeat`,
                    backgroundSize: "cover",
                  }}
                  className="h-[500px]"
                ></div>
              ) : (
                <div
                  style={{
                    background: `url(/default-image.jpg) center no-repeat`, // Fallback image
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
                <Listing listing={listing} key={listing._id} />
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
                <Listing listing={listing} key={listing._id} />
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
                <Listing listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
