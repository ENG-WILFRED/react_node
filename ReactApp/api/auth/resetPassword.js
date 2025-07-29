import axios from "axios";
import { API_URL } from "../utils/constants";

export const resetPassword = async (payload) => {
  return axios.post(`${API_URL}/auth/reset-password`, payload);
};