import axios from "axios";
import { API_URL } from "../../utils/constants";

export const fetchAllTransactions = async (token) => {
  return axios.get(`${API_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};