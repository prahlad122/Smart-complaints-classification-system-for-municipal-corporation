import Notification from "../models/Notification.js";
import User from "../models/User.js";

/* ---------- GET MY NOTIFICATIONS ---------- */
export const getMyNotifications = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    // Optional: filter unread only
    if (req.query.unread === "true") {
      filter.read = false;
    }

    const notifications = await Notification.find(filter)
      .populate("complaintId", "title status")
      .sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    console.error("Fetch notifications error:", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

/* ---------- GET UNREAD COUNT ---------- */
export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.json({ count });
  } catch (error) {
    console.error("Unread count error:", error);
    res.status(500).json({ message: "Failed to fetch unread count" });
  }
};

/* ---------- MARK AS READ ---------- */
export const markAsRead = async (req, res) => {
  try {
    const { ids, all } = req.body;

    const filter = { user: req.user.id, read: false };

    if (!all && ids) {
      filter._id = { $in: ids };
    }

    const result = await Notification.updateMany(filter, {
      $set: { read: true, readAt: new Date() },
    });

    res.json({
      message: "Notifications marked as read",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({ message: "Failed to mark notifications as read" });
  }
};

/* ---------- DELETE NOTIFICATION ---------- */
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    // Verify ownership
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await notification.deleteOne();

    res.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({ message: "Failed to delete notification" });
  }
};

/* ---------- ADMIN BROADCAST ---------- */
export const adminBroadcast = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res
        .status(400)
        .json({ message: "Title and message are required" });
    }

    // Find all citizens
    const citizens = await User.find({ role: "citizen" }).select("_id");

    // Create a notification for each citizen
    const notifications = citizens.map((citizen) => ({
      user: citizen._id,
      type: "admin_message",
      title,
      message,
    }));

    await Notification.insertMany(notifications);

    res.json({
      message: `Broadcast sent to ${citizens.length} citizens`,
      count: citizens.length,
    });
  } catch (error) {
    console.error("Broadcast error:", error);
    res.status(500).json({ message: "Failed to send broadcast" });
  }
};
