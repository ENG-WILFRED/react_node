import axios from "axios";
import { API_URL } from "../utils/constants";

export const fetchTransactionsByUser = async (userId, token) => {
  return axios.get(`${API_URL}/transactions/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};