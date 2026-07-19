// src/services/api.js
import axios from "axios";

const API = import.meta.env.VITE_API || "http://127.0.0.1:8000/api/v1";

export const uploadPDF = async (file, onProgress) => {
  const form = new FormData();
  form.append("file", file);

  const res = await axios.post(`${API}/upload`, form, {
    onUploadProgress: (e) => {
      if (onProgress) {
        onProgress(Math.round((e.loaded * 100) / e.total));
      }
    },
  });
  return res.data;
};

export const sendMessage = async (message, sessionId) => {
  const res = await axios.post(`${API}/chat`, {
    message,
    session_id: sessionId,
  });
  return res.data;
};

export const getDocuments = async () => {
  const res = await axios.get(`${API}/documents`);
  return res.data;
};

export const getSession = () => {
  let id = localStorage.getItem("session");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("session", id);
  }
  return id;
};
