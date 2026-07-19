import React, { useState } from "react";

export default function DocumentList({ documents, onRefresh }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!documents || documents.length === 0) {
    return (
      <div
        style={{
          background: "white",
          padding: "10px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          border: "1px solid #e0e0e0",
          fontSize: "13px",
          color: "#9ca3af",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>📁 No documents loaded yet</span>
        {onRefresh && (
          <button
            onClick={onRefresh}
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
        )}
      </div>
    );
  }

  const displayCount = isExpanded ? documents.length : 3;
  const visibleDocs = documents.slice(0, displayCount);
  const hasMore = documents.length > 3;

  return (
    <div
      style={{
        background: "white",
        padding: "10px 16px",
        borderRadius: "8px",
        marginBottom: "16px",
        border: "1px solid #e0e0e0",
        fontSize: "13px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: "500", color: "#4b5563" }}>
            📁 Loaded ({documents.length}):
          </span>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px",
              maxHeight: isExpanded ? "200px" : "auto",
              overflowY: isExpanded ? "auto" : "visible",
            }}
          >
            {visibleDocs.map((doc, i) => (
              <span
                key={i}
                style={{
                  background: "#e5e7eb",
                  padding: "2px 10px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#1f2937",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                📄 {doc}
              </span>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {hasMore && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                padding: "2px 10px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                background: "white",
                cursor: "pointer",
                fontSize: "12px",
                color: "#4b5563",
              }}
            >
              {isExpanded ? "▲ Show less" : `▼ +${documents.length - 3} more`}
            </button>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              style={{
                padding: "2px 10px",
                border: "1px solid #d1d5db",
                borderRadius: "4px",
                background: "white",
                cursor: "pointer",
                fontSize: "12px",
                color: "#4b5563",
              }}
            >
              🔄
            </button>
          )}
        </div>
      </div>

      {/* Document count badge */}
      {documents.length > 0 && (
        <div
          style={{
            marginTop: "6px",
            fontSize: "11px",
            color: "#9ca3af",
          }}
        >
          Total: {documents.length} document(s)
        </div>
      )}
    </div>
  );
}
