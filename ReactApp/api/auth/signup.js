import axios from "axios";
import { API_URL } from "../utils/constants";

export const signup = async (payload) => {
  return axios.post(`${API_URL}/auth/signup`, payload);
};