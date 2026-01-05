import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import axios from "axios";

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
