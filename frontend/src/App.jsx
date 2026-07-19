// src/App.jsx
import React, { useState, useEffect } from "react";
import Chat from "./components/Chat";
import Upload from "./components/Upload";
import DocumentList from "./components/DocumentList";
import { getDocuments, getSession } from "./services/api";

function App() {
  const [documents, setDocuments] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const sessionId = getSession();

  const loadDocs = async () => {
    try {
      setLoading(true);
      const res = await getDocuments();
      setDocuments(res.documents || []);
      setIsReady(res.documents?.length > 0);
    } catch (e) {
      console.error("Failed to load docs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleUploadSuccess = () => {
    loadDocs();
  };

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        maxWidth: "960px",
        margin: "0 auto",
        padding: "16px",
        minHeight: "100vh",
        background: "#f5f5f5",
      }}
    >
      {/* Header */}
      <header
        style={{
          background: "white",
          padding: "12px 20px",
          borderRadius: "8px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "28px" }}>🤖</span>
          <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
            OpsPilot
          </h1>
          <span
            style={{
              fontSize: "12px",
              padding: "2px 12px",
              borderRadius: "12px",
              background: isReady ? "#d1fae5" : "#f3f4f6",
              color: isReady ? "#065f46" : "#6b7280",
            }}
          >
            {isReady ? `${documents.length} doc(s)` : "No docs"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "12px", color: "#9ca3af" }}>
            Session: {sessionId.slice(0, 8)}
          </span>
          <button
            onClick={loadDocs}
            style={{
              padding: "4px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "4px",
              background: "white",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* Upload */}
      <Upload onUploadSuccess={handleUploadSuccess} />

      {/* Document List - Updated */}
      <DocumentList documents={documents} onRefresh={loadDocs} />

      {/* Chat */}
      <Chat isReady={isReady} />
    </div>
  );
}

export default App;
