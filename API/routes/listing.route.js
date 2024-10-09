import express from "express";
import {
  createListing,
  deleteListing,
  updateListing,
  getListing,
} from "../controller/listing.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
const router = express.Router();

router.post("/create", verifyToken, createListing);
router.delete("/deleteListing/:id/:index", deleteListing);
router.post("/update/:id", verifyToken, updateListing);
router.get("/getListing/:id", getListing);

export default router;
