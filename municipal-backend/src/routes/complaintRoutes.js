import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

import {
  createComplaint,
  getMyComplaints,
  deleteComplaint,
  getComplaintStats,
  getAllComplaints,
  updateComplaint,
} from "../controllers/complaintController.js";

const router = express.Router();

/* ---------- USER ROUTES ---------- */

// Create complaint
router.post("/", protect, upload.single("image"), createComplaint);

// Get logged-in user's complaints
router.get("/my", protect, getMyComplaints);

// Delete complaint
router.delete("/:id", protect, deleteComplaint);


/* ---------- ADMIN ROUTES ---------- */

// Get dashboard stats
router.get("/stats", protect, admin, getComplaintStats);

// Get all complaints
router.get("/admin", protect, admin, getAllComplaints);

// Update complaint (status / department)
router.put("/:id", protect, admin, updateComplaint);


export default router;