import axios from "axios";
import { API_URL } from "../../utils/constants";

export const downloadReceipt = async (id, token) => {
  return axios.get(`${API_URL}/transactions/${id}`, {
    responseType: 'blob',
    headers: { Authorization: `Bearer ${token}` },
  });
};
