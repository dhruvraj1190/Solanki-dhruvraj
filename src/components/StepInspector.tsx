import React from 'react';
import { AlgorithmStep, AlgorithmType, RouteResult, MstResult, MaxFlowResult } from '../types';
import { Cpu, Layers, GitBranch } from 'lucide-react';

interface StepInspectorProps {
  selectedAlgorithm: AlgorithmType;
  currentStep: AlgorithmStep | null;
  routeResult: RouteResult | null;
  mstResult: MstResult | null;
  maxFlowResult: MaxFlowResult | null;
  theme?: 'dark' | 'light';
}

export const StepInspector: React.FC<StepInspectorProps> = ({
  selectedAlgorithm,
  currentStep,
  routeResult,
  mstResult,
  maxFlowResult,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const getComplexityInfo = () => {
    switch (selectedAlgorithm) {
      case 'dijkstra':
        return {
          time: 'O((V + E) log V)',
          space: 'O(V)',
          name: "Dijkstra's Algorithm (Min-Heap PriorityQueue)",
          description: 'Extracts min-cost node via binary heap. Relaxes adjacent edges factoring sirens and flood delays.',
        };
      case 'astar':
        return {
          time: 'O(E)',
          space: 'O(V)',
          name: 'A* Heuristic Search (Euclidean Lower Bound)',
          description: 'Guides search vector directly towards destination using admissible geometric lower bound distance.',
        };
      case 'kruskal':
        return {
          time: 'O(E log E)',
          space: 'O(V + E)',
          name: "Kruskal's Algorithm (Disjoint Set Union)",
          description: 'Sorts all edges by clearance hours; uses Union-Find with path compression and rank to prevent cycles.',
        };
      case 'maxflow':
        return {
          time: 'O(V · E²)',
          space: 'O(V²)',
          name: 'Edmonds-Karp Maximum Flow (BFS Ford-Fulkerson)',
          description: 'Finds augmenting paths in residual network via BFS to calculate peak civilian vehicle throughput.',
        };
      case 'toposort':
        return {
          time: 'O(V + E)',
          space: 'O(V + E)',
          name: "Kahn's Topological Sort (In-Degree Queue)",
          description: 'Sequences disaster action protocol dependencies without circular deadlocks.',
        };
    }
  };

  const complexity = getComplexityInfo();

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm transition-colors duration-200 ${
        isDark
          ? 'bg-[#0f172a]/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header: Algorithm Name & Complexity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <span className="text-xs font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
            <Cpu className="w-4 h-4 text-rose-500" />
            {complexity.name}
          </span>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{complexity.description}</p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span
            className={`px-2.5 py-0.5 rounded-lg border font-semibold ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-amber-300'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            Time: {complexity.time}
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-lg border font-semibold ${
              isDark
                ? 'bg-slate-950 border-slate-800 text-sky-300'
                : 'bg-sky-50 border-sky-200 text-sky-800'
            }`}
          >
            Space: {complexity.space}
          </span>
        </div>
      </div>

      {/* Real-Time Traversal Output / Step Log */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Layers className="w-3.5 h-3.5 text-rose-500" />
            Live Execution Step Log
          </span>
          {currentStep && (
            <span className="text-slate-500">
              Step #{currentStep.stepNumber}
            </span>
          )}
        </div>

        <div
          className={`p-3.5 rounded-xl border text-xs font-mono leading-relaxed min-h-[58px] flex flex-col justify-center ${
            isDark
              ? 'bg-slate-950 border-slate-800 text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          {currentStep ? (
            <div>
              <p className="font-semibold mb-1 text-slate-900 dark:text-white">{currentStep.description}</p>
              {currentStep.metricNotes && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">{currentStep.metricNotes}</p>
              )}
            </div>
          ) : (
            <p className="text-slate-400 italic">Select an algorithm and click Play or Step Forward to trace execution.</p>
          )}
        </div>
      </div>

      {/* Internal Data Structure State Snapshot (Heap / DSU) */}
      {currentStep?.heapState && currentStep.heapState.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <GitBranch className="w-3.5 h-3.5" />
              Min-PriorityQueue Heap State ({currentStep.heapState.length} active keys)
            </span>
          </div>

          <div
            className={`flex flex-wrap gap-1.5 p-2.5 rounded-xl border max-h-24 overflow-y-auto ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {currentStep.heapState.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-mono border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <span className="font-bold text-slate-900 dark:text-white">{item.node}</span>
                <span className="text-slate-400">:</span>
                <span className="text-amber-600 dark:text-amber-300 font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disjoint Set Union (DSU) Table Snapshot for Kruskal */}
      {currentStep?.dsuState && currentStep.dsuState.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
              <GitBranch className="w-3.5 h-3.5" />
              Disjoint Set Forest (Path Compression & Rank)
            </span>
          </div>

          <div
            className={`grid grid-cols-4 sm:grid-cols-6 gap-1.5 p-2.5 rounded-xl border max-h-24 overflow-y-auto ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            {currentStep.dsuState.slice(0, 12).map((item, idx) => (
              <div
                key={idx}
                className={`p-1.5 rounded-lg border text-[10px] font-mono text-center ${
                  isDark
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-slate-200 text-slate-800 shadow-xs'
                }`}
              >
                <div className="font-bold text-slate-900 dark:text-white">{item.element}</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-semibold">→ {item.parent}</div>
                <div className="text-slate-400 text-[9px]">r:{item.rank}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Summary Bar */}
      {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'astar') && routeResult && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Estimated ETA</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{routeResult.estimatedTimeMinutes} min</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Physical Distance</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{routeResult.totalDistanceKm} km</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Nodes Expanded</span>
            <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-300">{routeResult.nodesVisitedCount}</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Safety Score</span>
            <span className="text-sm font-bold font-mono text-sky-600 dark:text-sky-400">{routeResult.safetyScore}%</span>
          </div>
        </div>
      )}

      {selectedAlgorithm === 'kruskal' && mstResult && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Backbone Edges</span>
            <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">{mstResult.mstEdgeIds.length} segments</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Clearance Effort</span>
            <span className="text-sm font-bold font-mono text-amber-600 dark:text-amber-400">{mstResult.totalClearanceHours} hours</span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Components</span>
            <span className="text-sm font-bold font-mono text-emerald-600 dark:text-emerald-400">{mstResult.connectedComponents} connected</span>
          </div>
        </div>
      )}

      {selectedAlgorithm === 'maxflow' && maxFlowResult && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Max Evacuation Flow</span>
            <span className="text-sm font-bold font-mono text-indigo-600 dark:text-indigo-400">
              {maxFlowResult.maxVehiclesPerHour.toLocaleString()} veh/hr
            </span>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <span className="text-[10px] font-mono text-slate-500 block">Choke Points Identified</span>
            <span className="text-sm font-bold font-mono text-rose-600 dark:text-rose-400">
              {maxFlowResult.bottleneckEdgeIds.length} bottleneck cuts
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
