import axios from "axios";
import { API_URL } from "../../utils/constants";

export const verifyEmail = async (payload) => {
  return axios.post(`${API_URL}/auth/verify-email`, payload);
};