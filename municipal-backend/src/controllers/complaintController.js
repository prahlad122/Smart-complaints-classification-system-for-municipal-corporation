import Complaint from "../models/Complaint.js";
import Notification from "../models/Notification.js";

import { classifyWithAI } from "../utils/aiClassifier.js";
import {
  departmentMap,
  getFallbackResult,
} from "../utils/classifyComplaint.js";

import {
  notifyComplaintReceived,
  notifyStatusChange,
  notifyDepartmentChange,
  notifyComplaintResolved,
} from "../utils/notificationHelper.js";

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

    /* ---------- AI CLASSIFICATION ---------- */

    let category;
    let department;
    let priority;
    let aiConfidence;
    let aiSummary;
    let classificationMethod;

    const aiResult = await classifyWithAI(title, description);

    if (aiResult) {
      // AI classification succeeded
      classificationMethod = "AI";
      category = aiResult.category;
      priority = aiResult.priority;
      aiConfidence = aiResult.confidence;
      aiSummary = aiResult.summary;
      console.log("AI classification used:", category, priority);
    } else {
      // Fallback to keyword rules
      classificationMethod = "Fallback";
      const fallback = getFallbackResult(title, description);
      category = fallback.category;
      priority = fallback.priority;
      aiConfidence = fallback.confidence;
      aiSummary = fallback.summary;
      console.log("Fallback classifier used:", category, priority);
    }

    department = departmentMap[category] || "General Department";

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
      aiConfidence,
      aiSummary,

      image: req.file ? req.file.path : null,
      status: "Pending",

      history: [
        {
          action: `Complaint submitted (classified by ${classificationMethod})`,
        },
      ],
    });

    //  Notify citizen that complaint was received
    notifyComplaintReceived(req.user.id, complaint);

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
    });

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

    const inProgress = await Complaint.countDocuments({
      status: "In Progress",
    });

    const resolved = await Complaint.countDocuments({
      status: "Resolved",
    });

    res.json({
      total,
      pending,
      inProgress,
      resolved,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({
      message: "Failed to fetch complaint stats",
    });
  }
};

/* ---------------- DETAILED STATS (ADMIN) ---------------- */

export const getComplaintStatsByCategory = async (req, res) => {
  try {
    const byCategory = await Complaint.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byStatus = await Complaint.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const byPriority = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    const byDepartment = await Complaint.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({
      byCategory,
      byStatus,
      byPriority,
      byDepartment,
    });
  } catch (error) {
    console.error("Detailed stats error:", error);
    res.status(500).json({
      message: "Failed to fetch detailed stats",
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

      //  Send appropriate notification
      if (status === "Resolved") {
        notifyComplaintResolved(complaint.user, complaint);
      } else {
        notifyStatusChange(complaint.user, complaint, status);
      }
    }

    /* ---------------- DEPARTMENT UPDATE ---------------- */

    if (department && department !== complaint.department) {
      complaint.department = department;

      complaint.history.push({
        action: `Assigned to ${department}`,
      });

      //  Create notification
      notifyDepartmentChange(complaint.user, complaint, department);
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
