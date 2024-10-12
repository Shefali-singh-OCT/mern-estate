import listing from "../../Models/ListingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const list = await listing
      .create(req.body)
      .then((us) => {
        res.status(201).json(us);
      })
      .catch((err) => {
        console.log("error occured");
      });
  } catch (error) {
    next(error);
  }
};
export const deleteListing = async (req, res, next) => {
  const listings = await listing.findById(req.params.id);
  let indexToRemove = Number(req.params.index);
  if (!listings) {
    return next(errorHandler(404, "Listing not found"));
  }
  try {
    if (listings.imagesUrls.length === 1) {
      await listing.findByIdAndDelete(req.params.id);
      res.status(200).json("Listing has been deleted");
    } else {
      listings.imagesUrls.splice(indexToRemove, 1);
      await listings.save();
      res.status(201).json(listings);
    }
  } catch (error) {
    next(error);
  }
};
export const updateListing = async (req, res, next) => {
  const list = await listing.findById(req.params.id);
  if (!list) {
    return next(errorHandler(404, "Listing not found"));
  }
  if (req.user.id !== list.userRef) {
    return next(errorHandler(401, "You can only update your own listing"));
  }
  try {
    const updateListing = await listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updateListing);
  } catch (error) {
    next(error);
  }
};
export const getListing = async (req, res, next) => {
  try {
    const list = await listing.findById(req.params.id);
    if (!list) {
      return next(errorHandler(404, "Listing not found"));
    }
    res.status(201).json(list);
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    // Handle offer
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] }; // Default to both false and true if not specified
    } else {
      offer = offer === "true"; // Convert to boolean
    }
    // Handle furnished
    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] }; // Default to both false and true
    } else {
      furnished = furnished === "true"; // Convert to boolean
    }

    // Handle parking
    let parkings = req.query.parking;
    if (parkings === undefined || parkings === "false") {
      parkings = { $in: [false, true] }; // Default to both false and true
    } else {
      parkings = parkings === "true"; // Convert to boolean
    }
    // Handle type
    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] }; // Default to both 'sale' and 'rent' types
    }
    // Handle search term
    const searchTerm = req.query.searchTerm || "";

    // Handle sorting
    const sort = req.query.sort || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1; // Default to descending order
    // Fetch listings with the given filters
    const list = await listing
        .find({
        name: { $regex: searchTerm, $options: "i" }, // Case-insensitive search
        offer,
        furnished,
        parkings,
        type,
      })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    return res.status(200).json(list);
  } catch (error) {
    next(error); // Properly handle errors
  }
};
