import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingCard({ listing }) {
  // Destructure listing from props
  console.log(listing);
  const photo = listing?.imagesUrls?.[0];

  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={photo}
          alt="listing image"
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300 "
        />
      </Link>
      <div className="p-3 flex flex-col gap-2 w-full">
        <p className="text-lg font-semibold text-slate-700 truncate ">
          {listing.name} {/* Accessing listing's name */}
        </p>
        <div className="flex items-center gap-2">
          <MdLocationOn className="h-4 w-4 text-green-700" />
          <p className="truncate text-sm text-gray-600 w-full">
            {listing.address} {/* Accessing listing's address */}
          </p>
        </div>
        <p className="line-clamp-2 text-sm text-gray-600">
          {listing.description} {/* Accessing listing's description */}
        </p>
        <p className="text-slate-500 mt-2 font-semibold flex items-center">
          $
          {listing.offer
            ? (listing.regularPrice - listing.discountPrice).toLocaleString(
                "en-US"
              )
            : listing.regularPrice.toLocaleString("en-US")}{" "}
          {/* Fixing toLocaleString() */}
          {listing.type === "rent" && "/month"}
        </p>
        <div className="text-slate-700 flex gap-4">
          <div className="font-bold text-sm">
            {listing.bedrooms > 1
              ? `${listing.bedrooms} beds`
              : `${listing.bedrooms} bed`}
          </div>
          <div className="font-bold text-sm">
            {listing.bathrooms > 1
              ? `${listing.bathrooms} baths`
              : `${listing.bathrooms} bath`}
          </div>
        </div>
      </div>
    </div>
  );
}
