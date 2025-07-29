// File: api/transactions/fetchById.js
import axios from "axios";
import { API_URL } from "../utils/constants";

export const fetchTransactionById = async (id, token) => {
  return axios.get(`${API_URL}/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};