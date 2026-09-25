import React, { useState } from 'react';
import { JAVA_SOURCE_FILES, JavaSourceFile } from '../data/javaSourceFiles';
import {
  Code2,
  Copy,
  Check,
  Download,
  Play,
  Terminal,
  FileCode,
  FolderArchive,
} from 'lucide-react';

interface JavaCodeStudioProps {
  onRunTerminalBenchmark: () => void;
  terminalLogs: string[];
  isRunningTerminal: boolean;
  theme?: 'dark' | 'light';
  onDownloadZip: () => void;
  isDownloadingZip?: boolean;
}

export const JavaCodeStudio: React.FC<JavaCodeStudioProps> = ({
  onRunTerminalBenchmark,
  terminalLogs,
  isRunningTerminal,
  theme = 'dark',
  onDownloadZip,
  isDownloadingZip = false,
}) => {
  const isDark = theme === 'dark';
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');

  const currentFile: JavaSourceFile = JAVA_SOURCE_FILES[selectedFileIndex] || JAVA_SOURCE_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const blob = new Blob([currentFile.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = currentFile.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`rounded-2xl border flex flex-col overflow-hidden shadow-sm transition-colors duration-200 ${
        isDark
          ? 'bg-[#0f172a] border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Studio Header */}
      <div
        className={`flex flex-wrap items-center justify-between px-5 py-3.5 border-b gap-3 ${
          isDark
            ? 'bg-slate-950 border-slate-800'
            : 'bg-slate-50 border-slate-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-xl border ${
              isDark
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'bg-amber-100 border-amber-300 text-amber-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold flex items-center gap-2">
              Java Data Structures Studio
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                  isDark
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-amber-100 border-amber-300 text-amber-800'
                }`}
              >
                Java 17+ (OOP / DSA)
              </span>
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Clean source code for hackathon submission with zero external dependencies
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab('terminal');
              onRunTerminalBenchmark();
            }}
            disabled={isRunningTerminal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-xl transition-colors shadow-xs cursor-pointer"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>{isRunningTerminal ? 'Running JVM...' : 'Run Java Main'}</span>
          </button>

          <button
            onClick={handleCopyCode}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy File'}</span>
          </button>

          <button
            onClick={onDownloadZip}
            disabled={isDownloadingZip}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-colors cursor-pointer whitespace-nowrap ${
              isDark
                ? 'text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30'
                : 'text-amber-900 bg-amber-100 hover:bg-amber-200 border-amber-300'
            }`}
            title="Download full Maven project as a ZIP archive"
          >
            {isDownloadingZip ? (
              <FolderArchive className="w-3.5 h-3.5 animate-bounce" />
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloadingZip ? 'Zipping...' : 'Download Project (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* Main Tabs (Editor vs JVM Terminal) */}
      <div
        className={`flex items-center justify-between px-5 py-2.5 border-b text-xs ${
          isDark
            ? 'bg-slate-900 border-slate-800'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('editor')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
              activeTab === 'editor'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Source Code</span>
          </button>

          <button
            onClick={() => setActiveTab('terminal')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold transition-colors cursor-pointer ${
              activeTab === 'terminal'
                ? isDark
                  ? 'bg-slate-800 text-emerald-400 shadow-xs'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>JVM Output Terminal</span>
            {terminalLogs.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        <div className="text-[11px] font-mono text-slate-500">
          File: <span className="font-bold text-slate-900 dark:text-white">{currentFile.filename}</span>
        </div>
      </div>

      {/* Content Body */}
      {activeTab === 'editor' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[480px]">
          {/* File Explorer Sidebar */}
          <div
            className={`p-3 border-r flex flex-col gap-1 overflow-y-auto max-h-[500px] ${
              isDark
                ? 'bg-slate-950 border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-mono text-slate-400 px-2 py-1 uppercase tracking-wider font-bold">
              Project Explorer
            </span>

            {JAVA_SOURCE_FILES.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors cursor-pointer ${
                  selectedFileIndex === idx
                    ? isDark
                      ? 'bg-slate-800 text-amber-300 font-semibold border border-slate-700'
                      : 'bg-white text-amber-800 font-semibold border border-amber-300 shadow-xs'
                    : isDark
                    ? 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    : 'text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span className="truncate">{file.filename}</span>
                <span
                  className={`text-[9px] px-1 py-0.5 rounded border uppercase ${
                    isDark
                      ? 'bg-slate-900 border-slate-800 text-slate-500'
                      : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  {file.category}
                </span>
              </button>
            ))}

            <div
              className={`mt-4 p-3 rounded-xl border text-[11px] ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span className="font-bold block mb-1 text-slate-900 dark:text-white">Run Locally:</span>
              <code className="block mt-1 p-1.5 rounded font-mono text-[10px] bg-slate-100 dark:bg-black/50 text-emerald-700 dark:text-emerald-300">
                javac -d bin *.java
                <br />
                java -cp bin com.emergency.planner.Main
              </code>
            </div>
          </div>

          {/* Code Viewer */}
          <div
            className={`md:col-span-3 flex flex-col overflow-hidden ${
              isDark ? 'bg-slate-950' : 'bg-white'
            }`}
          >
            <div
              className={`p-2.5 border-b flex items-center justify-between text-xs font-mono ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span className="truncate">{currentFile.description}</span>
              <button
                onClick={handleDownloadSingle}
                className="text-rose-600 hover:underline text-[11px] whitespace-nowrap ml-2 cursor-pointer font-semibold"
              >
                Download {currentFile.filename}
              </button>
            </div>

            <div
              className={`p-4 overflow-auto max-h-[460px] font-mono text-xs leading-relaxed ${
                isDark ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              <pre className="whitespace-pre">
                {currentFile.code.split('\n').map((line, idx) => (
                  <div key={idx} className="table-row hover:bg-slate-100 dark:hover:bg-slate-900/50">
                    <span className="table-cell pr-4 text-right select-none font-mono text-[11px] w-8 text-slate-400 dark:text-slate-600">
                      {idx + 1}
                    </span>
                    <span className="table-cell">{line}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        /* JVM Virtual Console Terminal */
        <div className="p-4 bg-black font-mono text-xs text-slate-200 min-h-[480px] max-h-[520px] overflow-y-auto flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-500 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>OpenJDK Runtime Environment (build 17.0.9+9)</span>
            </div>
            <span>com.emergency.planner.Main</span>
          </div>

          {terminalLogs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3 py-16">
              <Terminal className="w-8 h-8 text-slate-600" />
              <p>Ready to run Java Main application.</p>
              <button
                onClick={onRunTerminalBenchmark}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Execute Main.java
              </button>
            </div>
          ) : (
            <div className="space-y-1 font-mono text-xs">
              {terminalLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`${
                    log.startsWith('>>>')
                      ? 'text-amber-400 font-bold'
                      : log.includes('✔')
                      ? 'text-emerald-400'
                      : log.includes('✘')
                      ? 'text-rose-400'
                      : log.startsWith('===')
                      ? 'text-slate-500'
                      : 'text-slate-300'
                  }`}
                >
                  {log}
                </div>
              ))}
              {isRunningTerminal && (
                <div className="text-slate-400 flex items-center gap-1.5 mt-2">
                  <span className="animate-spin text-emerald-400">⠋</span> Running algorithms in virtual JVM sandbox...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
