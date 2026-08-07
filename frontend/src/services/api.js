// // src/services/api.js
// import axios from "axios";

// const API = import.meta.env.VITE_API || "http://127.0.0.1:8000/api/v1";

// export const uploadPDF = async (file, onProgress) => {
//   const form = new FormData();
//   form.append("file", file);

//   const res = await axios.post(`${API}/upload`, form, {
//     onUploadProgress: (e) => {
//       if (onProgress) {
//         onProgress(Math.round((e.loaded * 100) / e.total));
//       }
//     },
//   });
//   return res.data;
// };

// export const sendMessage = async (message, sessionId) => {
//   const res = await axios.post(`${API}/chat`, {
//     message,
//     session_id: sessionId,
//   });
//   return res.data;
// };

// export const getDocuments = async () => {
//   const res = await axios.get(`${API}/documents`);
//   return res.data;
// };

// export const getSession = () => {
//   let id = localStorage.getItem("session");
//   if (!id) {
//     id = crypto.randomUUID();
//     localStorage.setItem("session", id);
//   }
//   return id;
// };
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkHealth = async () => {
  const response = await apiClient.get("/health");
  return response.data;
};

export const fetchDocuments = async () => {
  const response = await apiClient.get("/documents");
  return response.data;
};

export const uploadPDFs = async (fileList) => {
  const formData = new FormData();
  Array.from(fileList).forEach((file) => {
    formData.append("files", file);
  });

  const response = await apiClient.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const sendQuestion = async (question, chatHistory) => {
  const response = await apiClient.post("/chat", {
    question,
    session_id: "default_session",
    chat_history: chatHistory,
  });
  return response.data;
};
