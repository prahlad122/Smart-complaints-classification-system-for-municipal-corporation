import API from "./api";

export const getNotifications = () => {
  return API.get("/notifications");
};
