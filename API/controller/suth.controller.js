import User from "../../Models/UserModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken"

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  try {
    const newuser = new User({ username, email, password : hashedPassword});
    await newuser.save();
    console.log("saved")
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
}

export const signin = async (req,res,next) =>{
   const {email,password} = req.body;
   try{
      const validuser = await User.findOne({email: email});
      if(!validuser){
        return next(errorHandler(404, 'user not found'))
      }
        const validpassword = bcryptjs.compareSync(
          password,
          validuser.password
        );
        if(!validpassword) return next(errorHandler(401, "wrong credentials:"))
        const token = jwt.sign({id: validuser._id},process.env.JWT_SECRET) 
        const {password: pass, ...userInfo} = validuser._doc 
        res
          .cookie('access_token', token, { httpOnly: true })
          .status(202)
          .json(userInfo);
   }catch(error){
    next(error)
   }
};