import React from "react";

export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
      }}
    >
      <span
        style={{
          display: "inline-block",
          width: "16px",
          height: "16px",
          border: "2px solid #e5e7eb",
          borderTop: "2px solid #2563eb",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <span style={{ fontSize: "14px", color: "#6b7280" }}>{text}</span>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
