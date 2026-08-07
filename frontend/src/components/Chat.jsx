// import React, { useState, useRef, useEffect } from "react";
// import { sendMessage, getSession } from "../services/api";

// export default function Chat({ isReady, onNewMessage }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const sessionId = getSession();
//   const endRef = useRef();

//   useEffect(() => {
//     endRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim() || loading) return;

//     const userMsg = { role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await sendMessage(input, sessionId);
//       const assistantMsg = {
//         role: "assistant",
//         content: res.response,
//         sources: res.sources || [],
//       };
//       setMessages((prev) => [...prev, assistantMsg]);
//       if (onNewMessage) onNewMessage(assistantMsg);
//     } catch (err) {
//       const msg = err.response?.data?.detail || "Failed to get response";
//       setError(msg);
//       setMessages((prev) => prev.slice(0, -1));
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKey = (e) => {
//     if (e.key === "Enter") handleSend();
//   };

//   return (
//     <div
//       style={{
//         background: "white",
//         borderRadius: "8px",
//         border: "1px solid #e0e0e0",
//         height: "450px",
//         display: "flex",
//         flexDirection: "column",
//         overflow: "hidden",
//       }}
//     >
//       {/* Messages */}
//       <div
//         style={{
//           flex: 1,
//           overflowY: "auto",
//           padding: "16px",
//           display: "flex",
//           flexDirection: "column",
//           gap: "12px",
//         }}
//       >
//         {messages.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               color: "#9ca3af",
//               marginTop: "60px",
//             }}
//           >
//             <div style={{ fontSize: "48px", marginBottom: "12px" }}>💬</div>
//             <p style={{ fontSize: "16px", color: "#4b5563" }}>Ask a question</p>
//             <p style={{ fontSize: "14px" }}>Upload a PDF and ask about it</p>
//             {!isReady && (
//               <div
//                 style={{
//                   marginTop: "16px",
//                   padding: "12px",
//                   background: "#fef3c7",
//                   border: "1px solid #fcd34d",
//                   borderRadius: "8px",
//                   fontSize: "14px",
//                   color: "#92400e",
//                   maxWidth: "400px",
//                   margin: "16px auto 0",
//                 }}
//               >
//                 ⚠️ No documents loaded. Upload a PDF first.
//               </div>
//             )}
//           </div>
//         ) : (
//           messages.map((msg, i) => (
//             <div
//               key={i}
//               style={{
//                 display: "flex",
//                 justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
//               }}
//             >
//               <div
//                 style={{
//                   maxWidth: "80%",
//                   padding: "8px 16px",
//                   borderRadius: "8px",
//                   background: msg.role === "user" ? "#2563eb" : "#f3f4f6",
//                   color: msg.role === "user" ? "white" : "#1f2937",
//                   wordBreak: "break-word",
//                 }}
//               >
//                 <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
//                 {msg.sources && msg.sources.length > 0 && (
//                   <div
//                     style={{
//                       fontSize: "11px",
//                       opacity: 0.7,
//                       marginTop: "4px",
//                     }}
//                   >
//                     📄 {msg.sources.join(", ")}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//         {loading && (
//           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//             <span
//               style={{
//                 display: "inline-block",
//                 width: "16px",
//                 height: "16px",
//                 border: "2px solid #e5e7eb",
//                 borderTop: "2px solid #2563eb",
//                 borderRadius: "50%",
//                 animation: "spin 0.8s linear infinite",
//               }}
//             />
//             <span>Thinking...</span>
//             <style>{`
//               @keyframes spin {
//                 0% { transform: rotate(0deg); }
//                 100% { transform: rotate(360deg); }
//               }
//             `}</style>
//           </div>
//         )}
//         {error && (
//           <div
//             style={{
//               background: "#fee2e2",
//               padding: "8px 12px",
//               borderRadius: "6px",
//               color: "#dc2626",
//               fontSize: "14px",
//             }}
//           >
//             ⚠️ {error}
//           </div>
//         )}
//         <div ref={endRef} />
//       </div>

//       {/* Input */}
//       <div
//         style={{
//           borderTop: "1px solid #e5e7eb",
//           padding: "12px",
//           background: "#fafafa",
//         }}
//       >
//         <div style={{ display: "flex", gap: "8px" }}>
//           <input
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyDown={handleKey}
//             placeholder={isReady ? "Ask something..." : "Upload a PDF first"}
//             disabled={!isReady || loading}
//             style={{
//               flex: 1,
//               padding: "8px 12px",
//               border: "1px solid #d1d5db",
//               borderRadius: "6px",
//               outline: "none",
//               fontSize: "14px",
//             }}
//           />
//           <button
//             onClick={handleSend}
//             disabled={!isReady || loading || !input.trim()}
//             style={{
//               padding: "8px 20px",
//               background:
//                 !isReady || loading || !input.trim() ? "#9ca3af" : "#2563eb",
//               color: "white",
//               border: "none",
//               borderRadius: "6px",
//               cursor:
//                 !isReady || loading || !input.trim()
//                   ? "not-allowed"
//                   : "pointer",
//               fontSize: "14px",
//               fontWeight: "500",
//             }}
//           >
//             {loading ? "..." : "Send"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useRef, useEffect } from "react";
// import { sendQuestion } from "../services/api";
// import LoadingSpinner from "./LoadingSpinner";

// export default function Chat({ loadedDocuments }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading) return;

//     if (!loadedDocuments || loadedDocuments.length === 0) {
//       setError(
//         "Please upload and index operational PDFs before asking questions.",
//       );
//       return;
//     }

//     setError("");
//     const userQuery = input.trim();
//     setInput("");

//     const historyPayload = messages.map((m) => ({
//       role: m.role,
//       content: m.content,
//     }));

//     const nextMessages = [...messages, { role: "user", content: userQuery }];
//     setMessages(nextMessages);
//     setLoading(true);

//     try {
//       const response = await sendQuestion(userQuery, historyPayload);
//       setMessages([
//         ...nextMessages,
//         {
//           role: "assistant",
//           content: response.answer,
//           citations: response.citations,
//         },
//       ]);
//     } catch (err) {
//       const msg = err.response?.data?.detail || "Failed to query assistant.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col h-screen bg-slate-950">
//       {/* Header */}
//       <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between bg-slate-900/40">
//         <div>
//           <h2 className="text-sm font-semibold text-slate-200">
//             OpsPilot Assistant
//           </h2>
//           <p className="text-xs text-slate-400">
//             Contextual search grounded strictly in indexed docs
//           </p>
//         </div>
//       </header>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-6">
//         {messages.length === 0 ? (
//           <div className="h-full flex flex-col items-center justify-center text-center text-slate-500">
//             <svg
//               className="w-12 h-12 mb-3 stroke-slate-600 fill-none"
//               strokeWidth="1.5"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
//               />
//             </svg>
//             <p className="text-sm font-medium">OpsPilot System Ready</p>
//             <p className="text-xs max-w-sm mt-1">
//               Upload operational manuals, rate cards, or contracts to start
//               chatting with citations.
//             </p>
//           </div>
//         ) : (
//           messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex gap-3 max-w-3xl ${
//                 msg.role === "user" ? "ml-auto flex-row-reverse" : ""
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
//                   msg.role === "user"
//                     ? "bg-blue-600"
//                     : "bg-slate-800 border border-slate-700"
//                 }`}
//               >
//                 {msg.role === "user" ? (
//                   <svg className="w-4 h-4 fill-white" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 ) : (
//                   <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 20 20">
//                     <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
//                   </svg>
//                 )}
//               </div>

//               <div
//                 className={`p-4 rounded-2xl text-xs leading-relaxed ${
//                   msg.role === "user"
//                     ? "bg-blue-600 text-white rounded-tr-none"
//                     : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
//                 }`}
//               >
//                 <p className="whitespace-pre-wrap">{msg.content}</p>

//                 {msg.citations && msg.citations.length > 0 && (
//                   <div className="mt-3 pt-3 border-t border-slate-800">
//                     <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 mb-1.5">
//                       <svg
//                         className="w-3.5 h-3.5 fill-current"
//                         viewBox="0 0 20 20"
//                       >
//                         <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
//                       </svg>
//                       Source Citations
//                     </span>
//                     <div className="flex flex-wrap gap-1.5">
//                       {msg.citations.map((cite, cIdx) => (
//                         <span
//                           key={cIdx}
//                           className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
//                         >
//                           {cite.source} (Pg {cite.page})
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}

//         {loading && (
//           <div className="flex gap-3 max-w-3xl">
//             <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
//               <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 20 20">
//                 <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
//               </svg>
//             </div>
//             <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl rounded-tl-none">
//               <LoadingSpinner label="Searching vector collection & synthesizing response..." />
//             </div>
//           </div>
//         )}

//         <div ref={chatEndRef} />
//       </div>

//       {/* Input */}
//       <div className="p-4 border-t border-slate-800 bg-slate-900/40">
//         {error && (
//           <div className="max-w-3xl mx-auto mb-3 flex items-center gap-2 text-red-400 text-xs bg-red-950/40 p-2.5 rounded-lg border border-red-800">
//             <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-3">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question grounded in your documents..."
//             className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 transition"
//           />
//           <button
//             type="submit"
//             disabled={loading || !input.trim()}
//             className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 rounded-xl flex items-center justify-center transition cursor-pointer"
//           >
//             <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
//               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
//             </svg>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
// import React, { useState, useRef, useEffect } from "react";
// import { sendQuestion } from "../services/api";
// import LoadingSpinner from "./LoadingSpinner";

// export default function Chat({ loadedDocuments }) {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const chatEndRef = useRef(null);

//   useEffect(() => {
//     chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages, loading]);

//   const handleSend = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || loading) return;

//     if (!loadedDocuments || loadedDocuments.length === 0) {
//       setError(
//         "Please upload and index operational PDFs before asking questions.",
//       );
//       return;
//     }

//     setError("");
//     const userQuery = input.trim();
//     setInput("");

//     const historyPayload = messages.map((m) => ({
//       role: m.role,
//       content: m.content,
//     }));

//     const nextMessages = [...messages, { role: "user", content: userQuery }];
//     setMessages(nextMessages);
//     setLoading(true);

//     try {
//       const response = await sendQuestion(userQuery, historyPayload);
//       setMessages([
//         ...nextMessages,
//         {
//           role: "assistant",
//           content: response.answer,
//           citations: response.citations,
//         },
//       ]);
//     } catch (err) {
//       const msg = err.response?.data?.detail || "Failed to query assistant.";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex-1 flex flex-col h-full w-full bg-slate-950 overflow-hidden">
//       {/* Scrollable Chat Window */}
//       <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
//         {messages.length === 0 ? (
//           <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 px-4">
//             <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
//               <svg className="w-6 h-6 fill-blue-500" viewBox="0 0 20 20">
//                 <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
//               </svg>
//             </div>
//             <p className="text-sm font-medium text-slate-300">
//               OpsPilot Assistant Ready
//             </p>
//             <p className="text-xs max-w-sm mt-1 text-slate-500">
//               Select or upload documents in the sidebar, then ask questions
//               grounded strictly in their text.
//             </p>
//           </div>
//         ) : (
//           messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`flex gap-3 max-w-3xl ${
//                 msg.role === "user" ? "ml-auto flex-row-reverse" : ""
//               }`}
//             >
//               <div
//                 className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
//                   msg.role === "user"
//                     ? "bg-blue-600"
//                     : "bg-slate-800 border border-slate-700"
//                 }`}
//               >
//                 {msg.role === "user" ? (
//                   <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 20 20">
//                     <path
//                       fillRule="evenodd"
//                       d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                 ) : (
//                   <svg
//                     className="w-3.5 h-3.5 fill-blue-400"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
//                   </svg>
//                 )}
//               </div>

//               <div
//                 className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
//                   msg.role === "user"
//                     ? "bg-blue-600 text-white rounded-tr-none"
//                     : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
//                 }`}
//               >
//                 <p className="whitespace-pre-wrap">{msg.content}</p>

//                 {msg.citations && msg.citations.length > 0 && (
//                   <div className="mt-3 pt-3 border-t border-slate-800/80">
//                     <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 mb-1.5">
//                       <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
//                         <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 4c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
//                       </svg>
//                       Verified Sources
//                     </span>
//                     <div className="flex flex-wrap gap-1.5">
//                       {msg.citations.map((cite, cIdx) => (
//                         <span
//                           key={cIdx}
//                           className="text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
//                         >
//                           {cite.source} (Pg {cite.page})
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}

//         {loading && (
//           <div className="flex gap-3 max-w-3xl">
//             <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
//               <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 20 20">
//                 <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
//               </svg>
//             </div>
//             <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl rounded-tl-none">
//               <LoadingSpinner label="Searching embeddings & generating answer..." />
//             </div>
//           </div>
//         )}

//         <div ref={chatEndRef} />
//       </div>

//       {/* Input Bar */}
//       <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md">
//         {error && (
//           <div className="max-w-3xl mx-auto mb-3 flex items-center gap-2 text-red-400 text-xs bg-red-950/40 p-2.5 rounded-lg border border-red-800">
//             <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20">
//               <path
//                 fillRule="evenodd"
//                 d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             <span>{error}</span>
//           </div>
//         )}

//         <form
//           onSubmit={handleSend}
//           className="max-w-3xl mx-auto flex gap-2 sm:gap-3"
//         >
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask a question about your indexed documents..."
//             className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition"
//           />
//           <button
//             type="submit"
//             disabled={loading || !input.trim()}
//             className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 sm:px-5 rounded-xl flex items-center justify-center transition cursor-pointer shrink-0"
//           >
//             <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
//               <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
//             </svg>
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import { sendQuestion } from "../services/api";

export default function Chat({ loadedDocuments }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!loadedDocuments || loadedDocuments.length === 0) {
      setError(
        "Please upload and index operational PDFs before asking questions.",
      );
      return;
    }

    setError("");
    const userQuery = input.trim();
    setInput("");

    const historyPayload = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const nextMessages = [...messages, { role: "user", content: userQuery }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await sendQuestion(userQuery, historyPayload);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: response.answer,
          citations: response.citations,
        },
      ]);
    } catch (err) {
      const msg = err.response?.data?.detail || "Failed to query assistant.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full w-full bg-slate-950 overflow-hidden">
      {/* Scrollable Chat Window - Handles all internal chat scrolling */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-12 px-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 fill-blue-500" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-300">
              OpsPilot Assistant Ready
            </p>
            <p className="text-xs max-w-sm mt-1 text-slate-500">
              Select or upload documents in the sidebar, then ask questions
              grounded strictly in their text.
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  msg.role === "user"
                    ? "bg-blue-600"
                    : "bg-slate-800 border border-slate-700"
                }`}
              >
                {msg.role === "user" ? (
                  <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-3.5 h-3.5 fill-blue-400"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
                  </svg>
                )}
              </div>

              <div
                className={`p-3.5 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>

                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-800/80">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-blue-400 mb-1.5">
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 4c1.255 0-2.443.29-3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                      </svg>
                      Verified Sources
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, cIdx) => (
                        <span
                          key={cIdx}
                          className="text-[10px] bg-slate-800/90 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                        >
                          {cite.source} (Pg {cite.page})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex gap-3 max-w-3xl">
            <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
              <svg className="w-4 h-4 fill-blue-400" viewBox="0 0 20 20">
                <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
              </svg>
            </div>
            <div className="bg-slate-900 border border-slate-800 p-3.5 sm:p-4 rounded-2xl rounded-tl-none flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-400">
                Searching embeddings & generating answer...
              </span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input Bar (Pinned at bottom) */}
      <div className="p-3 sm:p-4 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md shrink-0">
        {error && (
          <div className="max-w-3xl mx-auto mb-3 flex items-center gap-2 text-red-400 text-xs bg-red-950/40 p-2.5 rounded-lg border border-red-800">
            <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSend}
          className="max-w-3xl mx-auto flex gap-2 sm:gap-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your indexed documents..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-blue-500 focus:outline-none rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 transition"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-4 sm:px-5 rounded-xl flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
