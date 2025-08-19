// src/services/userService.js
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL;

/** Common headers */
const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export const getAllUsers = (token, page, perPage) =>
  axios.get(`${API_URL}/api/users`, {
    headers: authHeaders(token),
    params: { page, perPage },
  });

export const deleteUser = (token, userId) =>
  axios.delete(`${API_URL}/api/deleteuser/${userId}`, {
    headers: authHeaders(token),
  });

export const enableStockist = (token, userId, payload) =>
  axios.post(`${API_URL}/api/users/${userId}/enable-stockist`, payload, {
    headers: authHeaders(token),
  });

export const toggleAccount = (token, userId, isEnabled) => {
  return axios.put(`${API_URL}/api/admin/disable/${userId}`, {}, { headers: authHeaders(token) });
};

export const upgradeUser = (token, userId) =>
  axios.post(`${API_URL}/api/users/${userId}/upgrade`, {}, { headers: authHeaders(token) });
