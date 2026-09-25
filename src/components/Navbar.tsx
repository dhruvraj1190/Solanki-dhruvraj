import React from 'react';
import {
  Play,
  Download,
  Rocket,
  Code2,
  ShieldAlert,
  Sun,
  Moon,
  FolderArchive,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'map' | 'java_studio' | 'scheduler' | 'evacuation';
  theme: 'dark' | 'light';
  onTabChange: (tab: 'map' | 'java_studio' | 'scheduler' | 'evacuation') => void;
  onToggleTheme: () => void;
  onOpenDeployModal: () => void;
  onRunJavaBenchmark: () => void;
  onDownloadZip: () => void;
  isDownloadingZip?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  theme,
  onTabChange,
  onToggleTheme,
  onOpenDeployModal,
  onRunJavaBenchmark,
  onDownloadZip,
  isDownloadingZip = false,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`sticky top-0 z-40 flex items-center justify-between px-4 sm:px-6 py-3 transition-colors duration-200 border-b backdrop-blur-md ${
        isDark
          ? 'bg-slate-950/90 border-slate-800 text-slate-100'
          : 'bg-white/95 border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* Zone 1: Single Wordmark & Badge */}
      <div className="flex items-center gap-3">
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
            isDark
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
              : 'bg-rose-50 border-rose-200 text-rose-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
        </div>
        <a
          href="#top"
          onClick={e => {
            e.preventDefault();
            onTabChange('map');
          }}
          className={`text-sm sm:text-base font-bold tracking-tight transition-colors ${
            isDark ? 'text-white hover:text-rose-400' : 'text-slate-900 hover:text-rose-600'
          }`}
        >
          Emergency Road Planner
        </a>
        <span
          className={`hidden lg:inline-block text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
            isDark
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-950/40'
              : 'text-emerald-700 border-emerald-300 bg-emerald-50 font-semibold'
          }`}
        >
          Java 17 DSA
        </span>
      </div>

      {/* Zone 2: Clean Navigation Links */}
      <nav className="hidden md:flex items-center gap-5 text-xs sm:text-sm font-medium">
        <button
          onClick={() => onTabChange('map')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'map'
              ? isDark
                ? 'text-white font-bold'
                : 'text-rose-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Simulation Map
        </button>
        <button
          onClick={() => onTabChange('java_studio')}
          className={`transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'java_studio'
              ? isDark
                ? 'text-white font-bold'
                : 'text-amber-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Code2 className="w-3.5 h-3.5 text-amber-500" />
          Java Code Studio
        </button>
        <button
          onClick={() => onTabChange('evacuation')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'evacuation'
              ? isDark
                ? 'text-white font-bold'
                : 'text-indigo-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Evacuation Flow
        </button>
        <button
          onClick={() => onTabChange('scheduler')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'scheduler'
              ? isDark
                ? 'text-white font-bold'
                : 'text-emerald-600 font-bold'
              : isDark
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Protocol Scheduler
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Theme Toggle, Download ZIP, Run Java, Deploy) */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={onToggleTheme}
          aria-label={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
            isDark
              ? 'bg-slate-900 border-slate-700 text-amber-300 hover:bg-slate-800'
              : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Guaranteed JSZip In-Memory Download */}
        <button
          onClick={onDownloadZip}
          disabled={isDownloadingZip}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
            isDark
              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'text-emerald-800 bg-emerald-100 border-emerald-300 hover:bg-emerald-200 font-bold'
          }`}
          title="Generate and download full Java project as ZIP"
        >
          {isDownloadingZip ? (
            <FolderArchive className="w-3.5 h-3.5 animate-bounce" />
          ) : (
            <Download className="w-3.5 h-3.5" />
          )}
          <span>{isDownloadingZip ? 'Zipping...' : 'Download .ZIP'}</span>
        </button>

        {/* Run Java */}
        <button
          onClick={onRunJavaBenchmark}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
            isDark
              ? 'text-amber-300 bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20'
              : 'text-amber-800 bg-amber-100 border-amber-300 hover:bg-amber-200 font-bold'
          }`}
          title="Run Java Benchmark Suite in virtual runner"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Run Java</span>
        </button>

        {/* Deploy & Docs */}
        <button
          onClick={onOpenDeployModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 rounded-lg hover:bg-rose-500 transition-colors shadow-xs shadow-rose-900/30 cursor-pointer whitespace-nowrap"
        >
          <Rocket className="w-3.5 h-3.5" />
          <span>Deploy</span>
        </button>
      </div>
    </header>
  );
};
