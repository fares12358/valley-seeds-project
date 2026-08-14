import api from "./api.js";

export const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data.data; // { email, createdAt }
};

export const logout = async () => {
  await api.post("/auth/logout");
};

export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data.data;
};

export const forgotPassword = async (email) => {
  await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (token, newPassword) => {
  await api.post("/auth/reset-password", { token, newPassword });
};

export const updateCredentials = async ({ currentPassword, newEmail, newPassword }) => {
  const { data } = await api.put("/auth/credentials", { currentPassword, newEmail, newPassword });
  return data.data; // { email }
};
