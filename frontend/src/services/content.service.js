// content.service.js already exists and is correct — confirming no change needed
import api from "./api.js";

export const getAllContent = async () => {
  const { data } = await api.get("/content");
  return data.data;
};

export const getSection = async (section) => {
  const { data } = await api.get(`/content/${section}`);
  return data.data;
};

export const updateSection = async (section, payload) => {
  const { data } = await api.put(`/content/${section}`, payload);
  return data.data;
};
