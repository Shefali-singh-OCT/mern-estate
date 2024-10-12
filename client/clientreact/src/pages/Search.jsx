import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

export default function Search() {
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSideBarData({ ...sideBarData, type: e.target.id });
    } else if (e.target.id === "searchTerm") {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    } else if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false, // e.target.checked is already a boolean, no need to check if it's "true"
      });
    } else if (e.target.id === "sort_order") {
      const [sort = "created_at", order = "desc"] = e.target.value.split("_"); // Destructuring with default values
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermForUrl = urlParams.get("searchTerm");
    const typeForUrl = urlParams.get("type");
    const parkingForUrl = urlParams.get("parking") === "true"; // Convert to boolean
    const furnishedForUrl = urlParams.get("furnished") === "true"; // Convert to boolean
    const offerForUrl = urlParams.get("offer") === "true"; // Convert to boolean
    const sortForUrl = urlParams.get("sort") || "created_at";
    const orderForUrl = urlParams.get("order") || "desc";

    setSideBarData((prevData) => ({
      ...prevData,
      searchTerm: searchTermForUrl || "",
      type: typeForUrl || "all",
      parking: parkingForUrl,
      furnished: furnishedForUrl,
      offer: offerForUrl,
      sort: sortForUrl,
      order: orderForUrl,
    }));
    const fetchListing = async () => {
      setLoading(true);
      try {
        const searchQuery = urlParams.toString();
        setError(false)
        const res = await fetch(
          `http://localhost:3000/api/listing/get?${searchQuery}`
        );
        const data = await res.json();
        if (data.length > 8) {
          setShowMore(true);
        }else{
          setShowMore(false)
        }
        setLoading(false);
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setList(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchListing();
  }, [location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const urlParams = new URLSearchParams();
      urlParams.set("searchTerm", sideBarData.searchTerm);
      urlParams.set("type", sideBarData.type);
      urlParams.set("parking", sideBarData.parking);
      urlParams.set("furnished", sideBarData.furnished);
      urlParams.set("sort", sideBarData.sort);
      urlParams.set("order", sideBarData.order);
      urlParams.set("offer", sideBarData.offer);
      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`);
    } catch (error) {
      setError(error.message);
    }
  };
  const onShowMoreClick =  async ()=>{
    const numberListing = list.length;
    const startIndex = numberListing
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('startIndex',startIndex)
    const searchQuery = urlParams.toString()
    const res = await fetch(
      `http://localhost:3000/api/listing/get?${searchQuery}`
    );
    const data = await res.json()
    if(data.length < 9){
      setShowMore(false)
    }
    setList({
      ...list, ...data
    })
  }
  return (
    <div className="flex flex-col  md:flex-row md:min-h-screen">
      <div className="p-7 border-b-2 md:border-r-2">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-3 ">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className=" font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="all"
                className="w-5"
                checked={sideBarData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="rent"
                className="w-5"
                checked={sideBarData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="sale"
                className="w-5"
                checked={sideBarData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="offer"
                className="w-5"
                checked={sideBarData.offer}
                onChange={handleChange}
              />
              <span>offer</span>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap items-center">
            <label className=" font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="parking"
                className="w-5"
                checked={sideBarData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                name=""
                id="furnished"
                className="w-5"
                checked={sideBarData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className=" font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value={"regularPrice_desc"}>Price high to low</option>
              <option value={"regularPrice_asc"}>Price low to high</option>
              <option value={"createdAt_desc"}>Latest</option>
              <option value={"createdAt_asc"}>Oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-85">
            Search
          </button>
        </form>
      </div>
      <div className="flex-1">
        <h1 className="text-3xl font-semibold p-3 border-b text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && list?.length === 0 && (
            <p className="text-xl text-slate-700">No Listing found:</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}
          {!loading &&
            list &&
            list.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
          {showMore && (
            <button
              onClick={onShowMoreClick()}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show More
            </button>
          )}
          {error && (
            <p className="text-red-700 text-xl text-center w-full">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
