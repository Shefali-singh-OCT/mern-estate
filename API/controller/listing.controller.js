import listing from "../../Models/ListingModel.js"
import { errorHandler } from "../utils/error.js"

export const createListing = async (req,res,next) => {
    try{
     const list = await listing.create(req.body)
     res.status(201).json(list)
    }catch(error){
        next(error)
    }
}
export const deleteListing = async (req,res,next)=>{
    const listings = await listing.findById(req.params.id)

    if(!listings){
        return next(errorHandler(404, 'Listing not found'))
    }
    try{
       await listing.findByIdAndDelete(req.params.id)
       res.status(200).json('Listing has been deleted');
    }catch(error){
        next(error)
    }
}