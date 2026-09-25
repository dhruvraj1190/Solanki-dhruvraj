import React from 'react';
import {
  AlgorithmType,
  EmergencyVehicleType,
  CityNode,
  RouteResult,
  MstResult,
  MaxFlowResult,
} from '../types';
import { VEHICLE_CONFIGS } from '../data/defaultCityGraph';
import {
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  Ambulance,
  Flame,
  Shield,
  Bus,
  Truck,
  Sliders,
  AlertOctagon,
} from 'lucide-react';

interface AlgorithmControlsProps {
  nodes: CityNode[];
  selectedAlgorithm: AlgorithmType;
  selectedVehicle: EmergencyVehicleType;
  startNodeId: string;
  endNodeId: string;
  isPlaying: boolean;
  playbackSpeed: number;
  currentStepIndex: number;
  totalSteps: number;
  isSimulatingVehicle: boolean;
  routeResult: RouteResult | null;
  mstResult: MstResult | null;
  maxFlowResult: MaxFlowResult | null;
  theme?: 'dark' | 'light';
  onSelectAlgorithm: (algo: AlgorithmType) => void;
  onSelectVehicle: (v: EmergencyVehicleType) => void;
  onSelectStartNode: (id: string) => void;
  onSelectEndNode: (id: string) => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onResetSteps: () => void;
  onChangeSpeed: (speed: number) => void;
  onTriggerVehicleRun: () => void;
  onApplyScenario: (scenario: 'flood' | 'bridge_collapse' | 'gas_blast' | 'clear') => void;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  nodes,
  selectedAlgorithm,
  selectedVehicle,
  startNodeId,
  endNodeId,
  isPlaying,
  playbackSpeed,
  currentStepIndex,
  totalSteps,
  isSimulatingVehicle,
  routeResult,
  theme = 'dark',
  onSelectAlgorithm,
  onSelectVehicle,
  onSelectStartNode,
  onSelectEndNode,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onResetSteps,
  onChangeSpeed,
  onTriggerVehicleRun,
  onApplyScenario,
}) => {
  const isDark = theme === 'dark';

  const getVehicleIcon = (type: EmergencyVehicleType) => {
    switch (type) {
      case 'ambulance':
        return <Ambulance className="w-4 h-4 text-emerald-500" />;
      case 'fire_truck':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'police_cruiser':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'evacuation_bus':
        return <Bus className="w-4 h-4 text-amber-500" />;
      case 'heavy_rescue':
        return <Truck className="w-4 h-4 text-purple-500" />;
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 space-y-4 shadow-sm transition-colors duration-200 ${
        isDark
          ? 'bg-[#0f172a]/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Top Bar: Algorithm Segmented Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-rose-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
            DSA Engine Selection
          </span>
        </div>

        {/* Algorithm Tabs */}
        <div className="grid grid-cols-2 sm:flex items-center gap-1.5 p-1 rounded-xl border bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
          <button
            onClick={() => onSelectAlgorithm('dijkstra')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedAlgorithm === 'dijkstra'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Dijkstra (Heap)
          </button>
          <button
            onClick={() => onSelectAlgorithm('astar')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedAlgorithm === 'astar'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            A* Heuristic
          </button>
          <button
            onClick={() => onSelectAlgorithm('kruskal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedAlgorithm === 'kruskal'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Kruskal MST (DSU)
          </button>
          <button
            onClick={() => onSelectAlgorithm('maxflow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
              selectedAlgorithm === 'maxflow'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Edmonds-Karp (Flow)
          </button>
        </div>
      </div>

      {/* Row 2: Routing Config (Origin, Target, Vehicle) */}
      {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'astar' || selectedAlgorithm === 'maxflow') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Origin Node Picker */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
              Origin (Source Point)
            </label>
            <select
              value={startNodeId}
              onChange={e => onSelectStartNode(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-rose-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  [{n.id}] {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Node Picker */}
          <div>
            <label className="block text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
              Destination / Hazard Target
            </label>
            <select
              value={endNodeId}
              onChange={e => onSelectEndNode(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs rounded-xl border focus:outline-none focus:border-rose-500 ${
                isDark
                  ? 'bg-slate-950 border-slate-700 text-slate-200'
                  : 'bg-slate-50 border-slate-300 text-slate-900'
              }`}
            >
              {nodes.map(n => (
                <option key={n.id} value={n.id}>
                  [{n.id}] {n.name}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Selector */}
          {selectedAlgorithm !== 'maxflow' ? (
            <div>
              <label className="block text-[11px] font-mono font-medium text-slate-500 dark:text-slate-400 mb-1">
                Emergency Dispatch Unit
              </label>
              <div className="flex items-center gap-1.5">
                {(['ambulance', 'fire_truck', 'police_cruiser', 'evacuation_bus', 'heavy_rescue'] as EmergencyVehicleType[]).map(
                  vType => {
                    const cfg = VEHICLE_CONFIGS[vType];
                    const isSelected = selectedVehicle === vType;
                    return (
                      <button
                        key={vType}
                        onClick={() => onSelectVehicle(vType)}
                        title={`${cfg.name} (Speed: ${cfg.speedMultiplier}x, Siren bonus: ${cfg.sirenClearanceBonus * 100}%)`}
                        className={`flex-1 p-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-rose-500/20 border-rose-500 text-rose-500'
                            : isDark
                            ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {getVehicleIcon(vType)}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-end">
              <div className="w-full p-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-500/30 rounded-xl text-[11px] text-indigo-700 dark:text-indigo-300 font-mono">
                Objective: Max civilian vehicle evacuation rate (vehicles/hr)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Row 3: Step-by-Step Traversal Controller & Simulation Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 rounded-xl border border-slate-700 transition-colors cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play Trace'}</span>
          </button>

          <button
            onClick={onStepBack}
            disabled={currentStepIndex <= 0}
            className="px-2.5 py-1.5 text-xs rounded-xl border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            title="Step back"
          >
            ◀
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="px-2.5 py-1.5 text-xs rounded-xl border disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            title="Step forward"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onResetSteps}
            className="px-2.5 py-1.5 text-xs rounded-xl border cursor-pointer bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            title="Reset step counter"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
            Step <span className="text-rose-600 dark:text-rose-400 font-bold">{totalSteps > 0 ? currentStepIndex + 1 : 0}</span> / {totalSteps}
          </span>
        </div>

        {/* Playback Speed & Vehicle Dispatch Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-xl border text-[11px] font-mono bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <span className="text-slate-400 px-1">Speed:</span>
            {[1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => onChangeSpeed(s)}
                className={`px-2 py-0.5 rounded-lg cursor-pointer ${
                  playbackSpeed === s
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>

          {(selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'astar') && routeResult?.pathNodeIds && (
            <button
              onClick={onTriggerVehicleRun}
              disabled={isSimulatingVehicle || routeResult.pathNodeIds.length < 2}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-500/10 border border-emerald-300 dark:border-emerald-500/30 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 disabled:opacity-40 rounded-xl transition-colors cursor-pointer whitespace-nowrap"
            >
              <Ambulance className="w-3.5 h-3.5" />
              <span>{isSimulatingVehicle ? 'Dispatching...' : 'Dispatch Vehicle'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Row 4: Disaster Scenario Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
        <span className="font-mono text-[11px] font-medium flex items-center gap-1 text-slate-500 dark:text-slate-400">
          <AlertOctagon className="w-3.5 h-3.5 text-amber-500" />
          Simulate Scenario:
        </span>
        <button
          onClick={() => onApplyScenario('gas_blast')}
          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-300 transition-colors cursor-pointer"
        >
          💥 Downtown Gas Rupture
        </button>
        <button
          onClick={() => onApplyScenario('flood')}
          className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 text-sky-700 dark:text-sky-300 transition-colors cursor-pointer"
        >
          🌊 Canal Flash Flood
        </button>
        <button
          onClick={() => onApplyScenario('bridge_collapse')}
          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-slate-800 hover:bg-rose-100 dark:hover:bg-slate-700 text-rose-700 dark:text-rose-300 transition-colors cursor-pointer"
        >
          🌉 River Bridge Collapse
        </button>
        <button
          onClick={() => onApplyScenario('clear')}
          className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          Reset Roads
        </button>
      </div>
    </div>
  );
};
