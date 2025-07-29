import axios from "axios";
import { API_URL } from "../utils/constants";

export const resendVerification = async (payload) => {
  return axios.post(`${API_URL}/auth/resend-verification`, payload);
};