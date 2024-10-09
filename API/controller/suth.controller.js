import User from "../../Models/UserModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    const newuser = new User({ username, email, password: hashedPassword });
    await newuser.save();
    // const {password: pass,...rest} = ._doc
    // console.log("saved");
    // res.status(201).json(rest);

     const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET);
     const { password: pass, ...userInfo } = newuser._doc;
     res
       .cookie("access_token", token, {
         httpOnly: true, // Ensures the cookie is not accessible via JavaScript
         secure: true, // Set to true in production (requires HTTPS)
         sameSite: "None",
         maxAge: 24 * 60 * 60 * 1000,path: '/'
       })
       .status(201)
       .json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validuser = await User.findOne({ email: email });
    if (!validuser) {
      return next(errorHandler(404, "user not found"));
    }
    const validpassword = bcryptjs.compareSync(password, validuser.password);
    if (!validpassword) return next(errorHandler(401, "wrong credentials:"));
    const token = jwt.sign({ id: validuser._id }, process.env.JWT_SECRET);
    const { password: pass, ...userInfo } = validuser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true, // Ensures the cookie is not accessible via JavaScript
        secure: true, // Set to true in production (requires HTTPS)
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,path: '/'
      })
      .status(202)
      .json(userInfo);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET); 
      const { password: pass, ...rest } = user._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true, // Ensures the cookie is not accessible via JavaScript
          secure: true, // Set to true in production (requires HTTPS)
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,path: '/'
        })
        .status(200)
        .json(rest);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8); 
      const hashedPassword = bcryptjs.hashSync(generatePassword, 10); 
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save(); 
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie("access_token", token, {
          httpOnly: true, // Ensures the cookie is not accessible via JavaScript
          secure: true, // Set to true in production (requires HTTPS)
          sameSite: "None",
          maxAge: 24 * 60 * 60 * 1000,
          path: '/'
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};


