import api from "./api.js";

export const getMessages = async (params = {}) => {
  const { data } = await api.get("/contact/messages", { params });
  return data.data; // { messages, total, unreadCount }
};

// Toggle read state — pass read: true or read: false
export const setReadState = async (id, read) => {
  const { data } = await api.patch(`/contact/messages/${id}`, { read });
  return data.data;
};

export const deleteMessage = async (id) => {
  await api.delete(`/contact/messages/${id}`);
};

// Used by public website ContactSection
export const submitContact = async (formData) => {
  await api.post("/contact", formData);
};
