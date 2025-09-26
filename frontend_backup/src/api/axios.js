import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/", // Django backend
  withCredentials: true, // needed if using cookies for auth
});

export default api;
