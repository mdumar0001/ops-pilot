import React from "react";

export default function Home({ onNavigate }) {
  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-12 pt-20 pb-16 max-w-6xl mx-auto w-full text-center">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          Powered by Vector Embeddings & Grounded RAG
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6 max-w-4xl mx-auto">
          Turn Unstructured PDFs into{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Actionable Operational Intelligence
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Upload multi-page manuals, SOPs, rate cards, or contracts. Ask
          questions in natural language and receive answers backed by exact page
          citations.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onNavigate}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Launch Workspace</span>
            <svg
              className="w-4 h-4 fill-current group-hover:translate-x-0.5 transition-transform"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="px-6 lg:px-12 py-16 border-t border-slate-900 bg-slate-900/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-white mb-2">
              Built for Strict Grounding & Speed
            </h2>
            <p className="text-xs text-slate-400">
              Designed to prevent hallucinations by constraining responses to
              verified text chunks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                Automated Extraction
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-performance PDF ingestion that extracts, normalizes, and
                splits complex documents into optimal overlapping chunks.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 4c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                Exact Page Citations
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every generated answer includes clickable metadata links
                detailing the exact document name and page number used.
              </p>
            </div>

            <div className="bg-slate-900/80 border border-slate-800/80 p-6 rounded-2xl relative overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 0112.906-6.319l1.411-1.412a1 1 0 011.414 1.414l-1.412 1.411A8 8 0 112 10zm8-6a6 6 0 100 12 6 6 0 000-12z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-white mb-2">
                Contextual Memory
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Maintains dialogue context across multi-turn queries, enabling
                natural follow-up questions and refined searches.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
