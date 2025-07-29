import axios from "axios";
import { API_URL } from "../../utils/constants";

export const updateTransaction = async (id, payload, token) => {
  return axios.put(`${API_URL}/transactions/${id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};