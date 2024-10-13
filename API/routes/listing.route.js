import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/deleteListing/:id/:index", deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/getListing/:id", verifyToken,getListing);
router.get("/get",getListings)

export default router;
