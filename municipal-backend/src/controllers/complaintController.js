import Complaint from "../models/Complaint.js";

import { classifyWithAI } from "../utils/aiClassifier.js";
import {
  classifyComplaint,
  departmentMap,
  detectPriority,
} from "../utils/classifyComplaint.js";

/* ---------------- CREATE COMPLAINT ---------------- */
export const createComplaint = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    const lat = req.body.lat ? Number(req.body.lat) : undefined;
    const lng = req.body.lng ? Number(req.body.lng) : undefined;

    // Basic validation
    if (!title || !description || !location) {
      return res.status(400).json({
        message: "Title, description, and location are required",
      });
    }

    const text = `${title} ${description}`.toLowerCase().trim();

    let category;
    let department;
    let priority;

    /* ---------- AI CLASSIFICATION ---------- */

    const aiResult = await classifyWithAI(text);

    if (aiResult) {
        
      const text = `${title} ${description}`.toLowerCase().trim();

let category;
let department;
let priority;

const aiResult = await classifyWithAI(text);

if (aiResult) {

  console.log("🤖 AI classification used");

  category = aiResult.category || classifyComplaint(text);
  priority = aiResult.priority || detectPriority(text);

} else {

  console.log("⚙ Using fallback classifier");

  category = classifyComplaint(text);
  priority = detectPriority(text);

}

department = departmentMap[category] || "General Department";
      category = aiResult.category || classifyComplaint(text);

      priority = aiResult.priority || detectPriority(text);

      department = departmentMap[category] || "General Department";

    } else {
      /* ---------- FALLBACK RULE SYSTEM ---------- */

      category = classifyComplaint(text);

      department = departmentMap[category] || "General Department";

      priority = detectPriority(text);
    }

    /* ---------- CREATE COMPLAINT ---------- */

    const complaint = await Complaint.create({
      user: req.user.id,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),

      lat,
      lng,

      category,
      department,
      priority,

      image: req.file ? req.file.path : null,
      status: "Pending",

      history: [
        {
          action: "Complaint submitted",
        },
      ],
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create complaint error:", error);

    res.status(500).json({
      message: "Failed to submit complaint",
    });
  }
};

/* ---------------- GET MY COMPLAINTS ---------------- */

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id }).sort({
      createdAt: -1,
    }); // newest first

    res.status(200).json(complaints);
  } catch (error) {
    console.error("Fetch complaints error:", error);

    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
};

export const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    // Ensure user owns the complaint
    if (complaint.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await complaint.deleteOne();

    res.json({ message: "Complaint deleted successfully" });
  } catch (error) {
    console.error("Delete complaint error:", error);
    res.status(500).json({ message: "Failed to delete complaint" });
  }
};

export const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();

    const pending = await Complaint.countDocuments({
      status: "Pending",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    res.json({
      total,
      pending,
      resolved,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      message: "Failed to fetch complaint stats",
    });
  }
};

/* ---------------- GET ALL COMPLAINTS (ADMIN) ---------------- */

export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch complaints",
    });
  }
};

/* ---------------- UPDATE COMPLAINT (ADMIN) ---------------- */

import Notification from "../models/Notification.js";

export const updateComplaint = async (req, res) => {
  try {
    const { status, department } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    /* ---------------- STATUS UPDATE ---------------- */

    if (status && status !== complaint.status) {
      complaint.status = status;

      complaint.history.push({
        action: `Status changed to ${status}`,
      });

      // 🔔 Create notification
      await Notification.create({
        user: complaint.user,
        message: `Your complaint "${complaint.title}" status is now ${status}`,
      });
    }

    /* ---------------- DEPARTMENT UPDATE ---------------- */

    if (department && department !== complaint.department) {
      complaint.department = department;

      complaint.history.push({
        action: `Assigned to ${department}`,
      });

      // 🔔 Create notification
      await Notification.create({
        user: complaint.user,
        message: `Your complaint "${complaint.title}" was assigned to ${department}`,
      });
    }

    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error("Update complaint error:", error);

    res.status(500).json({
      message: "Update failed",
    });
  }
};
