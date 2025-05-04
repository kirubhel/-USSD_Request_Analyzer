import axios from "axios";

const BASE_URL = "http://localhost:8080";

export const fetchSummary = () => axios.get(`${BASE_URL}/report`);
export const fetchRequests = (limit = 10) =>
    axios.get(`${BASE_URL}/latest?n=${limit}`);
export const fetchBlacklist = () => axios.get(`${BASE_URL}/blacklist`);
export const addToBlacklist = (msisdn: string, reason: string) =>
    axios.post(`${BASE_URL}/AddToBlacklist`, {
      msisdn,
      reason,
    });
  
