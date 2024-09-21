import listing from "../../Models/ListingModel.js"

export const createListing = async (req,res,next) => {
    try{
     const list = await listing.create(req.body)
     res.status(201).json(list)
    }catch(error){
        next(error)
    }
}