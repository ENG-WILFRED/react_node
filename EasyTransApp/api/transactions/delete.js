import axios from "axios";
import { API_URL } from "../../utils/constants";

export const deleteTransaction = async (id, token) => {
  return axios.delete(`${API_URL}/transactions/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};