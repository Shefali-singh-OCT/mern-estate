import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
          <Swiper navigation>{listing.imagesUrls.map((url,index) => (
            <SwiperSlide key={url}>

           <div className='h-[550px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover', backgroundFit: 'cover',backgroundPosition: 'center'}}></div>

            </SwiperSlide>
          ))}</Swiper>
        </>
      )}
    </div>
  );
}
