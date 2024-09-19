import User from "../../Models/UserModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from 'bcryptjs'

export const test = (req, res, next) => {
  res.json({ 
    message: "api router is working", 
    name: "Shefali singh" });
};

export const updateUser = async (req,res,next) => {
   if(req.user.is !== req.params.id) return next(errorHandler(401, 'You can only update your own account'))
    try{
             if(req.body.password){
              req.body.password = bcryptjs.hashSync(req.body.password,10);
             }
             const updateUser = await User.findByIdAndUpdate(req.params.id ,{
              $set: {
                username:req.body.username,
                email:req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
              }
             },{new : true})
             const {password: pass, ...rest} = updateUser._doc

             res.status(200).json(rest);
    }catch{error}{
      next(error)
    }
}
