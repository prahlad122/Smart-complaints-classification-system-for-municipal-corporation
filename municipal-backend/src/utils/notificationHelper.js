import Notification from "../models/Notification.js";

/**
 * Create a notification safely — never throws, never blocks the caller.
 */
const safeCreate = async (data) => {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error(" Notification creation failed:", error.message);
  }
};

export const notifyComplaintReceived = (userId, complaint) => {
  safeCreate({
    user: userId,
    type: "complaint_received",
    title: "Complaint Submitted",
    message: `Your complaint "${complaint.title}" has been received and classified as ${complaint.category}. It has been assigned to ${complaint.department}.`,
    complaintId: complaint._id,
    complaintTitle: complaint.title,
  });
};

export const notifyStatusChange = (userId, complaint, newStatus) => {
  safeCreate({
    user: userId,
    type: "status_update",
    title: "Complaint Status Updated",
    message: `Your complaint "${complaint.title}" status has been updated to ${newStatus}.`,
    complaintId: complaint._id,
    complaintTitle: complaint.title,
  });
};

export const notifyDepartmentChange = (userId, complaint, newDepartment) => {
  safeCreate({
    user: userId,
    type: "department_change",
    title: "Complaint Reassigned",
    message: `Your complaint "${complaint.title}" has been assigned to ${newDepartment}.`,
    complaintId: complaint._id,
    complaintTitle: complaint.title,
  });
};

export const notifyComplaintResolved = (userId, complaint) => {
  safeCreate({
    user: userId,
    type: "complaint_resolved",
    title: "Complaint Resolved!",
    message: `Great news! Your complaint "${complaint.title}" has been resolved. Thank you for helping improve our city.`,
    complaintId: complaint._id,
    complaintTitle: complaint.title,
  });
};
