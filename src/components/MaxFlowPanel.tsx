import React from 'react';
import { CityNode, RoadEdge, MaxFlowResult } from '../types';
import { Truck, ArrowRight, AlertCircle } from 'lucide-react';

interface MaxFlowPanelProps {
  nodes: CityNode[];
  edges: RoadEdge[];
  sourceId: string;
  sinkId: string;
  maxFlowResult: MaxFlowResult | null;
  theme?: 'dark' | 'light';
  onSelectSource: (id: string) => void;
  onSelectSink: (id: string) => void;
}

export const MaxFlowPanel: React.FC<MaxFlowPanelProps> = ({
  nodes,
  edges,
  sourceId,
  sinkId,
  maxFlowResult,
  theme = 'dark',
  onSelectSource,
  onSelectSink,
}) => {
  const isDark = theme === 'dark';
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  return (
    <div
      className={`rounded-2xl border p-5 space-y-5 shadow-sm transition-colors duration-200 ${
        isDark
          ? 'bg-[#0f172a]/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-500" />
            <h2 className="text-sm font-bold">
              Evacuation Throughput & Bottleneck Solver
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                isDark
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              Edmonds-Karp / Ford-Fulkerson · O(V · E²)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Calculates max civilian vehicle throughput per hour from high-hazard disaster zones to fortified regional shelters.
          </p>
        </div>

        {/* Origin & Shelter Selectors */}
        <div className="flex items-center gap-2">
          <div>
            <select
              value={sourceId}
              onChange={e => onSelectSource(e.target.value)}
              className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  Hazard: {n.name.substring(0, 18)}
                </option>
              ))}
            </select>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
          <div>
            <select
              value={sinkId}
              onChange={e => onSelectSink(e.target.value)}
              className={`px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-indigo-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  Shelter: {n.name.substring(0, 18)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Flow KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-500 block mb-1">
            Max Civilian Evacuation Rate
          </span>
          <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
            {maxFlowResult ? maxFlowResult.maxVehiclesPerHour.toLocaleString() : '0'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">vehicles / hour</span>
        </div>

        <div
          className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-500 block mb-1">
            Min-Cut Choke Points Identified
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
            {maxFlowResult ? maxFlowResult.bottleneckEdgeIds.length : '0'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">saturated road cuts</span>
        </div>

        <div
          className={`p-4 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <span className="text-[11px] font-mono text-slate-500 block mb-1">
            Augmenting Path Iterations
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {maxFlowResult ? maxFlowResult.steps.length : '0'}
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">BFS residual augmentations</span>
        </div>
      </div>

      {/* Bottlenecks Breakdown */}
      {maxFlowResult && maxFlowResult.bottleneckEdgeIds.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-4 h-4" />
            <span>Critical Evacuation Choke Points (Min-Cut Saturated Segments)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {maxFlowResult.bottleneckEdgeIds.map(eId => {
              const edge = edges.find(e => e.id === eId);
              if (!edge) return null;
              const fromName = nodeMap.get(edge.from)?.name?.split(' ')[0] || edge.from;
              const toName = nodeMap.get(edge.to)?.name?.split(' ')[0] || edge.to;

              return (
                <div
                  key={eId}
                  className={`p-3 rounded-xl border text-xs ${
                    isDark
                      ? 'bg-rose-950/30 border-rose-500/30'
                      : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold mb-1">
                    <span className="text-slate-900 dark:text-white">Edge [{edge.id}]</span>
                    <span className="text-[10px] text-rose-600 dark:text-rose-300 uppercase">{edge.type}</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {fromName} ↔ {toName}
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-rose-600 dark:text-rose-400 font-semibold">
                    Saturated at {edge.capacityVehiclesPerHour.toLocaleString()} veh/hr
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Evacuation Guidelines */}
      <div
        className={`p-3.5 rounded-xl border text-xs leading-relaxed font-mono ${
          isDark
            ? 'bg-slate-950 border-slate-800 text-slate-400'
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <span className="font-bold block mb-1 text-slate-900 dark:text-white">Emergency Operations Directive:</span>
        To increase civilian survival throughput beyond the max flow limit, police convoys must widen or deploy pontoon bypasses across the identified min-cut bottleneck roads.
      </div>
    </div>
  );
};
