import axios from "axios";
import { API_URL } from "../utils/constants";

export const createTransaction = async (payload, token) => {
  return axios.post(`${API_URL}/transactions`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};