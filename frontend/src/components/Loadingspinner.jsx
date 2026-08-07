// import React from "react";

// export default function LoadingSpinner({ text = "Loading..." }) {
//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         gap: "8px",
//         padding: "8px 12px",
//       }}
//     >
//       <span
//         style={{
//           display: "inline-block",
//           width: "16px",
//           height: "16px",
//           border: "2px solid #e5e7eb",
//           borderTop: "2px solid #2563eb",
//           borderRadius: "50%",
//           animation: "spin 0.8s linear infinite",
//         }}
//       />
//       <span style={{ fontSize: "14px", color: "#6b7280" }}>{text}</span>
//       <style>{`
//         @keyframes spin {
//           0% { transform: rotate(0deg); }
//           100% { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// }
import React from "react";

export default function LoadingSpinner({ label = "Processing..." }) {
  return (
    <div className="flex items-center gap-2 text-xs text-blue-400">
      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>{label}</span>
    </div>
  );
}
