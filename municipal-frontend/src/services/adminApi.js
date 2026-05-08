import API from "./api";

export const getDetailedStats = () => API.get("/complaints/stats/detailed");

export const broadcastNotification = (data) =>
  API.post("/notifications/broadcast", data);
