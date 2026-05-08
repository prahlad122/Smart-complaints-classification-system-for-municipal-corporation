import API from "./api";

export const getNotifications = (unreadOnly = false) => {
  const params = unreadOnly ? "?unread=true" : "";
  return API.get(`/notifications${params}`);
};

export const getUnreadCount = () => API.get("/notifications/unread-count");

export const markNotificationsRead = (ids) =>
  API.patch("/notifications/read", { ids });

export const markAllRead = () =>
  API.patch("/notifications/read", { all: true });

export const deleteNotification = (id) =>
  API.delete(`/notifications/${id}`);

export const broadcastNotification = (data) =>
  API.post("/notifications/broadcast", data);
