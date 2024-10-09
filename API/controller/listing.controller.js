import listing from "../../Models/ListingModel.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req, res, next) => {
  try {
    const list = await listing
      .create(req.body)
      .then((us) => {
        console.log("Listing created successfullt: ", us);
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
