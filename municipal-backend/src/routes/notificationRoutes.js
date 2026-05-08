import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";
import {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  deleteNotification,
  adminBroadcast,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get logged-in user's notifications
router.get("/", protect, getMyNotifications);

// Get unread notification count (for polling)
router.get("/unread-count", protect, getUnreadCount);

// Mark notifications as read (batch or all)
router.patch("/read", protect, markAsRead);

// Delete a single notification
router.delete("/:id", protect, deleteNotification);

// Admin: broadcast to all citizens
router.post("/broadcast", protect, admin, adminBroadcast);

export default router;