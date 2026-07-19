import React, { useState, useRef, useEffect } from "react";
import { sendMessage, getSession } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

export default function Chat({ isReady, onNewMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const sessionId = getSession();
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await sendMessage(input, sessionId);
      const assistantMsg = {
        role: "assistant",
        content: res.response,
        sources: res.sources || [],
      };
      setMessages((prev) => [...prev, assistantMsg]);
      if (onNewMessage) onNewMessage(assistantMsg);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to get response";
      setError(msg);
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div
      style={{
        background: "white",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        height: "450px",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Messages */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {messages.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              color: "#9ca3af",
              marginTop: "60px",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>💬</div>
            <p style={{ fontSize: "16px", color: "#4b5563" }}>Ask a question</p>
            <p style={{ fontSize: "14px" }}>Upload a PDF and ask about it</p>
            {!isReady && (
              <div
                style={{
                  marginTop: "16px",
                  padding: "12px",
                  background: "#fef3c7",
                  border: "1px solid #fcd34d",
                  borderRadius: "8px",
                  fontSize: "14px",
                  color: "#92400e",
                  maxWidth: "400px",
                  margin: "16px auto 0",
                }}
              >
                ⚠️ No documents loaded. Upload a PDF first.
              </div>
            )}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
                  color: msg.role === "user" ? "white" : "#1f2937",
                  wordBreak: "break-word",
                }}
              >
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
                {msg.sources && msg.sources.length > 0 && (
                  <div
                    style={{
                      fontSize: "11px",
                      opacity: 0.7,
                      marginTop: "4px",
                    }}
                  >
                    📄 {msg.sources.join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        {loading && <LoadingSpinner text="Thinking..." />}
        {error && (
          <div
            style={{
              background: "#fee2e2",
              padding: "8px 12px",
              borderRadius: "6px",
              color: "#dc2626",
              fontSize: "14px",
            }}
          >
            ⚠️ {error}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div
        style={{
          borderTop: "1px solid #e5e7eb",
          padding: "12px",
          background: "#fafafa",
        }}
      >
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isReady ? "Ask something..." : "Upload a PDF first"}
            disabled={!isReady || loading}
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              outline: "none",
              fontSize: "14px",
            }}
          />
          <button
            onClick={handleSend}
            disabled={!isReady || loading || !input.trim()}
            style={{
              padding: "8px 20px",
              background:
                !isReady || loading || !input.trim() ? "#9ca3af" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor:
                !isReady || loading || !input.trim()
                  ? "not-allowed"
                  : "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
