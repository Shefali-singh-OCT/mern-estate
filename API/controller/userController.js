import listing from "../../Models/ListingModel.js";
import User from "../../Models/UserModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res, next) => {
  res.json({
    message: "api router is working",
    name: "Shefali singh",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only update your own account"));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updateUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, "You can only delete your own account"));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    return next(error);
  }
};

export const SignOut = (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json({ message: "user has been logged out" });
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  try {
    const listings = await listing.find({ userRef: req.params.id });
    if (!listings) {
      next(errorHandler(404, "you need to add some listing to see it!!"));
      return;
    }
    res.status(200).json(listings);
  } catch (error) {
    return next(error);
  }
};

export const getUserDetails = async (req,res,next)=>{
    try{
         const data = await User.findById(req.params.id);
         //console.log(data)
         if(!data) return next(errorHandler(404,"User not found")) 
          const {password: pass , ...rest} = data._doc
        res.status(200).json(rest)
    }catch(error){
      next(error);
    }
}