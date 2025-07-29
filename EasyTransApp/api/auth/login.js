import axios from "axios";
import { API_URL } from "../../utils/constants";

export const login = async (payload) => {
  return axios.post(`${API_URL}/auth/login`, payload);
};