import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    // 📍 Coordinates for Map View
    lat: {
      type: Number,
    },

    lng: {
      type: Number,
    },

    // Uploaded image
    image: String,

    //  AI Complaint Category
    category: {
      type: String,
      enum: [
        "Sanitation",
        "Road Maintenance",
        "Electricity",
        "Water Supply",
        "Other",
        "Uncategorized",
      ],
      default: "Uncategorized",
    },

    // 🏢 Assigned Department
    department: {
      type: String,
      default: "Unassigned",
    },

    // 📊 Complaint Status
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    //  Complaint Priority
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    history: [
      {
        action: String,
        date: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Complaint", complaintSchema);
