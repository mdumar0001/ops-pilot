// src/components/Upload.jsx
import React, { useState } from "react";
import { uploadPDF } from "../services/api";

export default function Upload({ onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({});
  const [errors, setErrors] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles = [];
    const errorList = [];

    // Validate all files
    for (let file of files) {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        errorList.push(`${file.name} - Only PDF files allowed`);
      } else if (file.size > 10 * 1024 * 1024) {
        errorList.push(`${file.name} - File too large (max 10MB)`);
      } else {
        validFiles.push(file);
      }
    }

    if (errorList.length > 0) {
      setErrors(errorList);
      setTimeout(() => setErrors([]), 5000);
    }

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setUploading(true);
    setProgress({});

    // Upload files one by one
    const results = [];
    for (let file of validFiles) {
      try {
        setProgress((prev) => ({ ...prev, [file.name]: 0 }));
        const result = await uploadPDF(file, (pct) => {
          setProgress((prev) => ({ ...prev, [file.name]: pct }));
        });
        results.push({ file: file.name, success: true, result });
        setUploadedFiles((prev) => [...prev, file.name]);
      } catch (err) {
        results.push({
          file: file.name,
          success: false,
          error: err.response?.data?.detail || "Upload failed",
        });
      }
    }

    setUploading(false);
    e.target.value = "";

    // Trigger parent refresh
    if (results.some((r) => r.success)) {
      onUploadSuccess();
    }

    // Show errors if any
    const failed = results.filter((r) => !r.success);
    if (failed.length > 0) {
      setErrors(failed.map((f) => `${f.file}: ${f.error}`));
      setTimeout(() => setErrors([]), 5000);
    }
  };

  const totalProgress = () => {
    const values = Object.values(progress);
    if (values.length === 0) return 0;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  };

  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <label
          style={{
            padding: "8px 16px",
            background: "#e5e7eb",
            borderRadius: "6px",
            cursor: uploading ? "not-allowed" : "pointer",
            fontSize: "14px",
            opacity: uploading ? 0.6 : 1,
          }}
        >
          📄 Upload PDFs
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            style={{ display: "none" }}
          />
        </label>
        {uploading && (
          <div style={{ flex: 1, minWidth: "150px" }}>
            <div
              style={{
                background: "#e5e7eb",
                borderRadius: "4px",
                height: "6px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: "#2563eb",
                  height: "100%",
                  width: `${totalProgress()}%`,
                  transition: "width 0.3s",
                }}
              />
            </div>
            <span style={{ fontSize: "12px", color: "#6b7280" }}>
              {Object.keys(progress).length} file(s) uploading...{" "}
              {totalProgress()}%
            </span>
          </div>
        )}
        {uploadedFiles.length > 0 && !uploading && (
          <span style={{ fontSize: "12px", color: "#16a34a" }}>
            ✅ {uploadedFiles.length} file(s) uploaded
          </span>
        )}
      </div>

      {/* Individual file progress */}
      {uploading && Object.keys(progress).length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {Object.entries(progress).map(([name, pct]) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "12px",
                color: "#4b5563",
              }}
            >
              <span
                style={{
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
              <div
                style={{
                  flex: 1,
                  background: "#e5e7eb",
                  borderRadius: "4px",
                  height: "4px",
                  maxWidth: "100px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    background: "#2563eb",
                    height: "100%",
                    width: `${pct}%`,
                    transition: "width 0.3s",
                  }}
                />
              </div>
              <span>{pct}%</span>
            </div>
          ))}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div
          style={{
            marginTop: "8px",
            padding: "8px 12px",
            background: "#fee2e2",
            borderRadius: "6px",
            color: "#dc2626",
            fontSize: "13px",
          }}
        >
          {errors.map((err, i) => (
            <div key={i}>⚠️ {err}</div>
          ))}
        </div>
      )}
    </div>
  );
}
