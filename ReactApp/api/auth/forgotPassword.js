import axios from "axios";
import { API_URL } from "../utils/constants";

export const forgotPassword = async (payload) => {
  return axios.post(`${API_URL}/auth/forgot-password`, payload);
};
