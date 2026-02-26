import axios from "axios";

const API = axios.create({
  baseURL: "https://backend-0o9s.onrender.com",
});

export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

export default API;