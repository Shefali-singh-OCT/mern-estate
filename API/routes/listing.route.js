import express from "express";
import { createListing ,deleteListing} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();
  
router.post("/create",verifyToken,createListing)
router.delete("/deleteListing/:id",deleteListing)

export default router