// // src/components/Upload.jsx
// import React, { useState } from "react";
// import { uploadPDF } from "../services/api";

// export default function Upload({ onUploadSuccess }) {
//   const [uploading, setUploading] = useState(false);
//   const [progress, setProgress] = useState({});
//   const [errors, setErrors] = useState([]);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const handleUpload = async (e) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     const validFiles = [];
//     const errorList = [];

//     // Validate all files
//     for (let file of files) {
//       if (!file.name.toLowerCase().endsWith(".pdf")) {
//         errorList.push(`${file.name} - Only PDF files allowed`);
//       } else if (file.size > 10 * 1024 * 1024) {
//         errorList.push(`${file.name} - File too large (max 10MB)`);
//       } else {
//         validFiles.push(file);
//       }
//     }

//     if (errorList.length > 0) {
//       setErrors(errorList);
//       setTimeout(() => setErrors([]), 5000);
//     }

//     if (validFiles.length === 0) {
//       e.target.value = "";
//       return;
//     }

//     setUploading(true);
//     setProgress({});

//     // Upload files one by one
//     const results = [];
//     for (let file of validFiles) {
//       try {
//         setProgress((prev) => ({ ...prev, [file.name]: 0 }));
//         const result = await uploadPDF(file, (pct) => {
//           setProgress((prev) => ({ ...prev, [file.name]: pct }));
//         });
//         results.push({ file: file.name, success: true, result });
//         setUploadedFiles((prev) => [...prev, file.name]);
//       } catch (err) {
//         results.push({
//           file: file.name,
//           success: false,
//           error: err.response?.data?.detail || "Upload failed",
//         });
//       }
//     }

//     setUploading(false);
//     e.target.value = "";

//     // Trigger parent refresh
//     if (results.some((r) => r.success)) {
//       onUploadSuccess();
//     }

//     // Show errors if any
//     const failed = results.filter((r) => !r.success);
//     if (failed.length > 0) {
//       setErrors(failed.map((f) => `${f.file}: ${f.error}`));
//       setTimeout(() => setErrors([]), 5000);
//     }
//   };

//   const totalProgress = () => {
//     const values = Object.values(progress);
//     if (values.length === 0) return 0;
//     return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
//   };

//   return (
//     <div style={{ marginBottom: "16px" }}>
//       <div
//         style={{
//           display: "flex",
//           gap: "12px",
//           alignItems: "center",
//           flexWrap: "wrap",
//         }}
//       >
//         <label
//           style={{
//             padding: "8px 16px",
//             background: "#e5e7eb",
//             borderRadius: "6px",
//             cursor: uploading ? "not-allowed" : "pointer",
//             fontSize: "14px",
//             opacity: uploading ? 0.6 : 1,
//           }}
//         >
//           📄 Upload PDFs
//           <input
//             type="file"
//             accept=".pdf"
//             multiple
//             onChange={handleUpload}
//             disabled={uploading}
//             style={{ display: "none" }}
//           />
//         </label>
//         {uploading && (
//           <div style={{ flex: 1, minWidth: "150px" }}>
//             <div
//               style={{
//                 background: "#e5e7eb",
//                 borderRadius: "4px",
//                 height: "6px",
//                 overflow: "hidden",
//               }}
//             >
//               <div
//                 style={{
//                   background: "#2563eb",
//                   height: "100%",
//                   width: `${totalProgress()}%`,
//                   transition: "width 0.3s",
//                 }}
//               />
//             </div>
//             <span style={{ fontSize: "12px", color: "#6b7280" }}>
//               {Object.keys(progress).length} file(s) uploading...{" "}
//               {totalProgress()}%
//             </span>
//           </div>
//         )}
//         {uploadedFiles.length > 0 && !uploading && (
//           <span style={{ fontSize: "12px", color: "#16a34a" }}>
//             ✅ {uploadedFiles.length} file(s) uploaded
//           </span>
//         )}
//       </div>

//       {/* Individual file progress */}
//       {uploading && Object.keys(progress).length > 0 && (
//         <div style={{ marginTop: "8px" }}>
//           {Object.entries(progress).map(([name, pct]) => (
//             <div
//               key={name}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 fontSize: "12px",
//                 color: "#4b5563",
//               }}
//             >
//               <span
//                 style={{
//                   maxWidth: "200px",
//                   overflow: "hidden",
//                   textOverflow: "ellipsis",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 {name}
//               </span>
//               <div
//                 style={{
//                   flex: 1,
//                   background: "#e5e7eb",
//                   borderRadius: "4px",
//                   height: "4px",
//                   maxWidth: "100px",
//                   overflow: "hidden",
//                 }}
//               >
//                 <div
//                   style={{
//                     background: "#2563eb",
//                     height: "100%",
//                     width: `${pct}%`,
//                     transition: "width 0.3s",
//                   }}
//                 />
//               </div>
//               <span>{pct}%</span>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Errors */}
//       {errors.length > 0 && (
//         <div
//           style={{
//             marginTop: "8px",
//             padding: "8px 12px",
//             background: "#fee2e2",
//             borderRadius: "6px",
//             color: "#dc2626",
//             fontSize: "13px",
//           }}
//         >
//           {errors.map((err, i) => (
//             <div key={i}>⚠️ {err}</div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { uploadPDFs } from "../services/api";

export default function Upload({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const handleFileChange = (e) => {
    setSelectedFiles(e.target.files);
    setError("");
    setStatusMsg("");
  };

  const handleUpload = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("Please choose at least one PDF file.");
      return;
    }

    setLoading(true);
    setError("");
    setStatusMsg("");

    try {
      const data = await uploadPDFs(selectedFiles);
      setStatusMsg(`Indexed ${data.total_chunks} chunk(s) across files!`);
      setSelectedFiles([]);
      onUploadSuccess(data.loaded_files);
    } catch (err) {
      const msg = err.response?.data?.detail || "Document processing failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-4">
      <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
        Upload Documents
      </h3>

      <input
        type="file"
        multiple
        accept=".pdf"
        onChange={handleFileChange}
        className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer mb-3"
      />

      {error && (
        <div className="flex items-center gap-1.5 text-red-400 text-xs mb-3 bg-red-950/40 p-2 rounded border border-red-900/50">
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

      {statusMsg && (
        <div className="flex items-center gap-1.5 text-emerald-400 text-xs mb-3 bg-emerald-950/40 p-2 rounded border border-emerald-900/50">
          <svg className="w-4 h-4 shrink-0 fill-current" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span>{statusMsg}</span>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-2 rounded-lg transition disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Extracting & Embedding...</span>
          </div>
        ) : (
          <>
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Index PDFs
          </>
        )}
      </button>
    </div>
  );
}
