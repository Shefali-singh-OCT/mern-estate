import express from "express";
import { createListing } from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();
  
router.post("/create",createListing)

export default router