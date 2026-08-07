// // src/App.jsx
// import React, { useState, useEffect } from "react";
// import Chat from "./components/Chat";
// import Upload from "./components/Upload";
// import DocumentList from "./components/DocumentList";
// import { getDocuments, getSession } from "./services/api";

// function App() {
//   const [documents, setDocuments] = useState([]);
//   const [isReady, setIsReady] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const sessionId = getSession();

//   const loadDocs = async () => {
//     try {
//       setLoading(true);
//       const res = await getDocuments();
//       setDocuments(res.documents || []);
//       setIsReady(res.documents?.length > 0);
//     } catch (e) {
//       console.error("Failed to load docs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadDocs();
//   }, []);

//   const handleUploadSuccess = () => {
//     loadDocs();
//   };

//   return (
//     <div
//       style={{
//         fontFamily: "system-ui, -apple-system, sans-serif",
//         maxWidth: "960px",
//         margin: "0 auto",
//         padding: "16px",
//         minHeight: "100vh",
//         background: "#f5f5f5",
//       }}
//     >
//       {/* Header */}
//       <header
//         style={{
//           background: "white",
//           padding: "12px 20px",
//           borderRadius: "8px",
//           marginBottom: "16px",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           border: "1px solid #e0e0e0",
//           flexWrap: "wrap",
//           gap: "8px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <span style={{ fontSize: "28px" }}>🤖</span>
//           <h1 style={{ fontSize: "20px", fontWeight: "600", margin: 0 }}>
//             OpsPilot
//           </h1>
//           <span
//             style={{
//               fontSize: "12px",
//               padding: "2px 12px",
//               borderRadius: "12px",
//               background: isReady ? "#d1fae5" : "#f3f4f6",
//               color: isReady ? "#065f46" : "#6b7280",
//             }}
//           >
//             {isReady ? `${documents.length} doc(s)` : "No docs"}
//           </span>
//         </div>
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <span style={{ fontSize: "12px", color: "#9ca3af" }}>
//             Session: {sessionId.slice(0, 8)}
//           </span>
//           <button
//             onClick={loadDocs}
//             style={{
//               padding: "4px 12px",
//               border: "1px solid #d1d5db",
//               borderRadius: "4px",
//               background: "white",
//               cursor: "pointer",
//               fontSize: "12px",
//             }}
//           >
//             🔄 Refresh
//           </button>
//         </div>
//       </header>

//       {/* Upload */}
//       <Upload onUploadSuccess={handleUploadSuccess} />

//       {/* Document List - Updated */}
//       <DocumentList documents={documents} onRefresh={loadDocs} />

//       {/* Chat */}
//       <Chat isReady={isReady} />
//     </div>
//   );
// }

// export default App;
// import React, { useState, useEffect } from "react";
// import Upload from "./components/Upload";
// import DocumentList from "./components/DocumentList";
// import Chat from "./components/Chat";
// import { fetchDocuments } from "./services/api";

// export default function App() {
//   const [documents, setDocuments] = useState([]);

//   useEffect(() => {
//     const syncDocs = async () => {
//       try {
//         const data = await fetchDocuments();
//         setDocuments(data.loaded_documents || []);
//       } catch (e) {
//         console.error("Backend connection error:", e);
//       }
//     };
//     syncDocs();
//   }, []);

//   const handleUploadSuccess = (updatedDocList) => {
//     setDocuments(updatedDocList);
//   };

//   return (
//     <div className="flex h-screen bg-slate-950 font-sans">
//       <aside className="w-80 bg-slate-900/60 border-r border-slate-800 p-4 flex flex-col h-screen">
//         <div className="mb-6">
//           <h1 className="text-lg font-bold text-white leading-tight">
//             OpsPilot
//           </h1>
//           <p className="text-xs text-slate-400">
//             Document Intelligence Platform
//           </p>
//         </div>

//         <Upload onUploadSuccess={handleUploadSuccess} />
//         <DocumentList documents={documents} />
//       </aside>

//       <Chat loadedDocuments={documents} />
//     </div>
//   );
// }
// import React, { useState, useEffect } from "react";
// import Home from "./components/Home";
// import Upload from "./components/Upload";
// import DocumentList from "./components/DocumentList";
// import Chat from "./components/Chat";
// import { fetchDocuments } from "./services/api";

// export default function App() {
//   const [activeTab, setActiveTab] = useState("home"); // 'home' | 'workspace'
//   const [documents, setDocuments] = useState([]);
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   useEffect(() => {
//     const syncDocs = async () => {
//       try {
//         const data = await fetchDocuments();
//         setDocuments(data.loaded_documents || []);
//       } catch (e) {
//         console.error("Backend connection error:", e);
//       }
//     };
//     syncDocs();
//   }, []);

//   const handleUploadSuccess = (updatedDocList) => {
//     setDocuments(updatedDocList);
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
//       {/* Top Global Navigation Bar */}
//       <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {activeTab === "workspace" && (
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 border border-slate-700/50"
//               aria-label="Toggle Document Drawer"
//             >
//               <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           )}
//           <button
//             onClick={() => setActiveTab("home")}
//             className="flex items-center gap-2 group text-left cursor-pointer"
//           >
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
//               O
//             </div>
//             <div>
//               <h1 className="text-sm font-bold text-white leading-none tracking-tight group-hover:text-blue-400 transition">
//                 OpsPilot
//               </h1>
//               <p className="text-[10px] text-slate-400 font-medium">
//                 Document Intelligence
//               </p>
//             </div>
//           </button>
//         </div>

//         <nav className="flex items-center gap-2">
//           <button
//             onClick={() => setActiveTab("home")}
//             className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
//               activeTab === "home"
//                 ? "bg-slate-800 text-white border border-slate-700"
//                 : "text-slate-400 hover:text-white hover:bg-slate-800/40"
//             }`}
//           >
//             Home
//           </button>
//           <button
//             onClick={() => setActiveTab("workspace")}
//             className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
//               activeTab === "workspace"
//                 ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
//                 : "bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20"
//             }`}
//           >
//             <span>Workspace</span>
//             <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
//           </button>
//         </nav>
//       </header>
//       {/* Main View Switcher */}
//       {activeTab === "home" ? (
//         <Home onNavigate={() => setActiveTab("workspace")} />
//       ) : (
//         <div className="flex-1 flex relative overflow-hidden h-[calc(100vh-4rem)]">
//           {/* Backdrop Overlay for Mobile Drawer */}
//           {sidebarOpen && (
//             <div
//               onClick={() => setSidebarOpen(false)}
//               className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
//             />
//           )}

//           {/* Left Sidebar: Sticky/Fixed height with independent scroll */}
//           <aside
//             className={`fixed md:sticky top-16 md:top-0 bottom-0 left-0 z-50 md:z-auto w-80 h-[calc(100vh-4rem)] bg-slate-900/90 md:bg-slate-900/50 border-r border-slate-800 p-4 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
//               sidebarOpen
//                 ? "translate-x-0"
//                 : "-translate-x-full md:translate-x-0"
//             }`}
//           >
//             <div className="flex items-center justify-between mb-4 md:hidden">
//               <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
//                 Document Controls
//               </span>
//               <button
//                 onClick={() => setSidebarOpen(false)}
//                 className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700"
//               >
//                 Close ✕
//               </button>
//             </div>

//             <Upload onUploadSuccess={handleUploadSuccess} />
//             <DocumentList documents={documents} />
//           </aside>

//           {/* Right Main Area: Independent Chat Workspace */}
//           <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-950">
//             <Chat loadedDocuments={documents} />
//           </main>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import Upload from "./components/Upload";
import DocumentList from "./components/DocumentList";
import Chat from "./components/Chat";
import { fetchDocuments } from "./services/api";

export default function App() {
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'workspace'
  const [documents, setDocuments] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const syncDocs = async () => {
      try {
        const data = await fetchDocuments();
        setDocuments(data.loaded_documents || []);
      } catch (e) {
        console.error("Backend connection error:", e);
      }
    };
    syncDocs();
  }, []);

  const handleUploadSuccess = (updatedDocList) => {
    setDocuments(updatedDocList);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans flex flex-col antialiased overflow-hidden">
      {/* Top Global Navigation Bar */}
      <header className="h-16 shrink-0 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md z-30 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeTab === "workspace" && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800/60 border border-slate-700/50"
              aria-label="Toggle Document Drawer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2 group text-left cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
              O
            </div>
            <div>
              <h1 className="text-sm font-bold text-white leading-none tracking-tight group-hover:text-blue-400 transition">
                OpsPilot
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                Document Intelligence
              </p>
            </div>
          </button>
        </div>

        <nav className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab("home")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
              activeTab === "home"
                ? "bg-slate-800 text-white border border-slate-700"
                : "text-slate-400 hover:text-white hover:bg-slate-800/40"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setActiveTab("workspace")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === "workspace"
                ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                : "bg-blue-600/10 text-blue-400 border border-blue-500/30 hover:bg-blue-600/20"
            }`}
          >
            <span>Workspace</span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
          </button>
        </nav>
      </header>

      {/* Main View Switcher */}
      {activeTab === "home" ? (
        <div className="flex-1 overflow-y-auto">
          <Home onNavigate={() => setActiveTab("workspace")} />
        </div>
      ) : (
        <div className="flex-1 flex relative overflow-hidden h-[calc(100vh-4rem)]">
          {/* Backdrop Overlay for Mobile Drawer */}
          {sidebarOpen && (
            <div
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
            />
          )}

          {/* Left Sidebar: Fixed view-height with isolated vertical scroll */}
          <aside
            className={`fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-80 h-full bg-slate-900/90 md:bg-slate-900/50 border-r border-slate-800 p-4 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out shrink-0 ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full md:translate-x-0"
            }`}
          >
            <div className="flex items-center justify-between mb-4 md:hidden">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Document Controls
              </span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 bg-slate-800 rounded border border-slate-700"
              >
                Close ✕
              </button>
            </div>

            <Upload onUploadSuccess={handleUploadSuccess} />
            <DocumentList documents={documents} />
          </aside>

          {/* Right Main Area: Independent Chat Workspace */}
          <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden bg-slate-950">
            <Chat loadedDocuments={documents} />
          </main>
        </div>
      )}
    </div>
  );
}
