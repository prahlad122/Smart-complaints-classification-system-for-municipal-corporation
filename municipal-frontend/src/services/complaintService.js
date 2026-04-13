import API from "./api";

// Create new complaint
export const createComplaint = (formData) =>
  API.post("/complaints", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Fetch logged-in user's complaints
export const getMyComplaints = () => API.get("/complaints/my");

export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);

export const getComplaintStats = () => API.get("/complaints/stats");

export const getAllComplaints = () => API.get("/complaints/admin");

export const updateComplaint = (id, data) => API.put(`/complaints/${id}`, data);
