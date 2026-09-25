import React, { useState } from 'react';
import {
  Rocket,
  Terminal,
  Globe,
  FileText,
  Copy,
  Check,
  Download,
  FolderArchive,
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: 'dark' | 'light';
  onDownloadZip?: () => void;
  isDownloadingZip?: boolean;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({
  isOpen,
  onClose,
  theme = 'dark',
  onDownloadZip,
  isDownloadingZip = false,
}) => {
  const isDark = theme === 'dark';
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'deploy_web' | 'run_java' | 'readme'>('deploy_web');

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sampleReadme = `# Emergency Road Planner (Java Data Structures & Algorithms)

> Mission-Critical Dynamic Routing, Evacuation Max-Flow, and Infrastructure Recovery Engine for Disaster Management.

## 🎯 Problem Statement
During severe emergencies (floods, gas explosions, earthquakes), civilian infrastructure collapses. Traditional GPS routing fails because:
1. Roads are dynamically compromised by floods, debris, or bridge collapses.
2. Emergency vehicles (ambulances with sirens vs heavy rescue bulldozers) have distinct clearance capabilities.
3. Evacuation routes bottleneck, creating catastrophic gridlocks.
4. Infrastructure restoration must connect all hospitals with minimal bulldozing effort without isolated pockets.

---

## ⚡ Algorithms & Data Structures Implemented (Java 17)

| Algorithm | Data Structure | Time Complexity | Space Complexity | Real-World Application |
| :--- | :--- | :--- | :--- | :--- |
| **Dijkstra's Algorithm** | Min-PriorityQueue (Binary Heap) | $O((V + E) \\log V)$ | $O(V)$ | Dynamic routing with sirens & flood multipliers |
| **A* Search** | Open/Closed Sets + Euclidean Heuristic | $O(E)$ | $O(V)$ | Ultra-fast urgent trauma center delivery |
| **Kruskal's MST** | Disjoint Set Union (DSU / Union-Find) | $O(E \\log E)$ | $O(V + E)$ | Critical backbone infrastructure recovery |
| **Edmonds-Karp** | Adjacency List + BFS Residual Network | $O(V \\cdot E^2)$ | $O(V^2)$ | Max civilian vehicle evacuation throughput |
| **Kahn's Topological Sort** | In-Degree Array + FIFO Queue | $O(V + E)$ | $O(V + E)$ | Multi-agency disaster action plan sequencing |

---

## 🚀 How to Run the Java Application

### Prerequisites
- JDK 17 or higher
- Maven 3.8+ (optional)

### Quick Run with Java Compiler
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/emergency-road-planner.git
cd emergency-road-planner

# Compile all Java sources
javac -d bin src/com/emergency/planner/**/*.java src/com/emergency/planner/Main.java

# Run the benchmark application
java -cp bin com.emergency.planner.Main
\`\`\`

### Run with Maven
\`\`\`bash
mvn clean package
mvn exec:java
\`\`\`

---

## 🌐 Deploying the Web Visualizer
Built with React 19, Tailwind CSS, and TypeScript.
\`\`\`bash
npm install
npm run build
# Deploy 'dist' folder to Vercel, Netlify, or Cloud Run
\`\`\`
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-3xl rounded-3xl border shadow-2xl overflow-hidden flex flex-col max-h-[88vh] ${
          isDark
            ? 'bg-slate-900 border-slate-700 text-slate-200'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500">
              <Rocket className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Deployment & Hackathon Submission Package
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Step-by-step instructions to deploy live and compile Java CLI
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-lg text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab Selection */}
        <div
          className={`flex items-center gap-2 px-6 py-2.5 border-b text-xs font-semibold ${
            isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-200 bg-white'
          }`}
        >
          <button
            onClick={() => setActiveTab('deploy_web')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'deploy_web'
                ? 'bg-rose-600 text-white font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Deploy Website</span>
          </button>

          <button
            onClick={() => setActiveTab('run_java')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'run_java'
                ? 'bg-amber-600 text-white font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Compile & Run Java</span>
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'readme'
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Hackathon README.md</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {activeTab === 'deploy_web' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Option 1: Deploy to Vercel (Instant Live URL)
                  </span>
                  <button
                    onClick={() => handleCopy('npm install -g vercel\nvercel --prod', 'vercel')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    {copiedSection === 'vercel' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'vercel' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl text-emerald-300 font-mono text-[11px] overflow-x-auto">
{`# 1. Build production static bundle
npm run build

# 2. Deploy directly via Vercel CLI
npx vercel --prod`}
                </pre>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Build command: <code className="text-slate-900 dark:text-white">npm run build</code> | Output directory: <code className="text-slate-900 dark:text-white">dist</code>
                </p>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    Option 2: Deploy to Netlify
                  </span>
                  <button
                    onClick={() => handleCopy('npm run build\nnpx netlify-cli deploy --prod --dir=dist', 'netlify')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    {copiedSection === 'netlify' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'netlify' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl text-sky-300 font-mono text-[11px] overflow-x-auto">
{`npm run build
npx netlify-cli deploy --prod --dir=dist`}
                </pre>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white block">
                  Option 3: GitHub Pages Deployment
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  Add <code className="text-slate-900 dark:text-white">"base": "./"</code> to your <code className="text-slate-900 dark:text-white">vite.config.ts</code>, push to GitHub, and enable GitHub Pages under Repository Settings → Pages → Deploy from branch (gh-pages or dist).
                </p>
              </div>
            </div>
          )}

          {activeTab === 'run_java' && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isDark
                    ? 'bg-amber-950/30 border-amber-500/30'
                    : 'bg-amber-50 border-amber-300'
                }`}
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white text-sm block">Download Full Java Project Archive (.zip)</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Pre-packaged zip containing complete Java 17 Maven project, all 11 source classes, and build config.
                  </p>
                </div>
                <button
                  onClick={onDownloadZip}
                  disabled={isDownloadingZip}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shrink-0 shadow-sm cursor-pointer"
                >
                  {isDownloadingZip ? (
                    <FolderArchive className="w-4 h-4 animate-bounce" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span>{isDownloadingZip ? 'Zipping...' : 'Download .zip Archive'}</span>
                </button>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-amber-600 dark:text-amber-300">
                    Standard Java 17 CLI Compilation
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        'mkdir -p bin\njavac -d bin src/com/emergency/planner/**/*.java src/com/emergency/planner/Main.java\njava -cp bin com.emergency.planner.Main',
                        'javac'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    {copiedSection === 'javac' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'javac' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl text-amber-300 font-mono text-[11px] overflow-x-auto">
{`# Create build directory
mkdir -p bin

# Compile all classes
javac -d bin src/com/emergency/planner/**/*.java src/com/emergency/planner/Main.java

# Execute main driver application
java -cp bin com.emergency.planner.Main`}
                </pre>
              </div>

              <div
                className={`p-4 rounded-2xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold font-mono text-amber-600 dark:text-amber-300">
                    Maven Build & Execution
                  </span>
                  <button
                    onClick={() => handleCopy('mvn clean package\nmvn exec:java', 'mvn')}
                    className="flex items-center gap-1 text-[11px] font-mono text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                  >
                    {copiedSection === 'mvn' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSection === 'mvn' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-black/80 rounded-xl text-emerald-300 font-mono text-[11px] overflow-x-auto">
{`mvn clean package
mvn exec:java`}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'readme' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">
                  Hackathon Ready README.md (Copy & paste into your GitHub repo)
                </span>
                <button
                  onClick={() => handleCopy(sampleReadme, 'readme')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  {copiedSection === 'readme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSection === 'readme' ? 'Copied README!' : 'Copy Entire README'}</span>
                </button>
              </div>

              <div
                className={`p-4 rounded-2xl border font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <pre className="whitespace-pre-wrap">{sampleReadme}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-t text-xs ${
            isDark ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-slate-200 bg-slate-50 text-slate-600'
          }`}
        >
          <span className="font-mono">
            Emergency Road Planner · Ready for Hackathon Judges & Deployment
          </span>
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
            }`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
