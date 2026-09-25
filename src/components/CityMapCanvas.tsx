import React, { useState, useEffect, useRef } from 'react';
import {
  CityNode,
  RoadEdge,
  AlgorithmType,
  EmergencyVehicleType,
  RouteResult,
  MstResult,
  MaxFlowResult,
  AlgorithmStep,
} from '../types';
import {
  Flame,
  Home,
  Zap,
  Package,
  AlertTriangle,
  Ban,
  Activity,
  Compass,
} from 'lucide-react';

interface CityMapCanvasProps {
  nodes: CityNode[];
  edges: RoadEdge[];
  startNodeId: string;
  endNodeId: string;
  selectedAlgorithm: AlgorithmType;
  selectedVehicle: EmergencyVehicleType;
  routeResult: RouteResult | null;
  mstResult: MstResult | null;
  maxFlowResult: MaxFlowResult | null;
  currentStep: AlgorithmStep | null;
  theme?: 'dark' | 'light';
  onSelectNode: (nodeId: string, role: 'start' | 'end') => void;
  onToggleEdgeBlockage: (edgeId: string) => void;
  onCycleEdgeTraffic: (edgeId: string) => void;
  onCycleEdgeFlood: (edgeId: string) => void;
  isSimulatingVehicle: boolean;
  onFinishVehicleSimulation: () => void;
}

export const CityMapCanvas: React.FC<CityMapCanvasProps> = ({
  nodes,
  edges,
  startNodeId,
  endNodeId,
  selectedAlgorithm,
  selectedVehicle,
  routeResult,
  mstResult,
  maxFlowResult,
  currentStep,
  theme = 'dark',
  onSelectNode,
  onToggleEdgeBlockage,
  onCycleEdgeTraffic,
  onCycleEdgeFlood,
  isSimulatingVehicle,
  onFinishVehicleSimulation,
}) => {
  const isDark = theme === 'dark';
  const [hoveredNode, setHoveredNode] = useState<CityNode | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<RoadEdge | null>(null);
  const [vehiclePosition, setVehiclePosition] = useState<{ x: number; y: number; angle: number } | null>(null);
  const [selectedEdgeForEdit, setSelectedEdgeForEdit] = useState<RoadEdge | null>(null);

  const animRef = useRef<number | null>(null);
  const animStartTime = useRef<number | null>(null);

  // Active path node and edge IDs based on algorithm and current step
  const activePathEdges = new Set<string>();
  const activePathNodes = new Set<string>();
  const visitedNodes = new Set<string>(currentStep?.visitedNodeIds || []);
  const frontierNodes = new Set<string>(currentStep?.frontierNodeIds || []);

  if (selectedAlgorithm === 'kruskal' && mstResult) {
    mstResult.mstEdgeIds.forEach(id => activePathEdges.add(id));
  } else if (selectedAlgorithm === 'maxflow' && maxFlowResult) {
    maxFlowResult.bottleneckEdgeIds.forEach(id => activePathEdges.add(id));
  } else if ((selectedAlgorithm === 'dijkstra' || selectedAlgorithm === 'astar') && routeResult) {
    if (currentStep?.pathSoFarNodeIds && currentStep.pathSoFarNodeIds.length > 0) {
      currentStep.pathSoFarNodeIds.forEach(id => activePathNodes.add(id));
    } else {
      routeResult.pathNodeIds.forEach(id => activePathNodes.add(id));
      routeResult.pathEdgeIds.forEach(id => activePathEdges.add(id));
    }
  }

  // Vehicle traversal animation
  useEffect(() => {
    if (!isSimulatingVehicle || !routeResult || routeResult.pathNodeIds.length < 2) {
      setVehiclePosition(null);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    const nodeCoords = routeResult.pathNodeIds
      .map(id => nodes.find(n => n.id === id))
      .filter((n): n is CityNode => !!n);

    if (nodeCoords.length < 2) return;

    const segments: { p1: CityNode; p2: CityNode; length: number }[] = [];
    let totalLength = 0;
    for (let i = 0; i < nodeCoords.length - 1; i++) {
      const p1 = nodeCoords[i];
      const p2 = nodeCoords[i + 1];
      const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      segments.push({ p1, p2, length: len });
      totalLength += len;
    }

    const duration = Math.max(3000, totalLength * 12);
    animStartTime.current = performance.now();

    const animate = (now: number) => {
      if (!animStartTime.current) animStartTime.current = now;
      const elapsed = now - animStartTime.current;
      const progress = Math.min(1, elapsed / duration);

      const targetDist = progress * totalLength;
      let accumulated = 0;
      let currentSeg = segments[0];

      for (const seg of segments) {
        if (accumulated + seg.length >= targetDist) {
          currentSeg = seg;
          break;
        }
        accumulated += seg.length;
      }

      const segProgress = (targetDist - accumulated) / Math.max(currentSeg.length, 1);
      const curX = currentSeg.p1.x + (currentSeg.p2.x - currentSeg.p1.x) * segProgress;
      const curY = currentSeg.p1.y + (currentSeg.p2.y - currentSeg.p1.y) * segProgress;
      const angle = (Math.atan2(currentSeg.p2.y - currentSeg.p1.y, currentSeg.p2.x - currentSeg.p1.x) * 180) / Math.PI;

      setVehiclePosition({ x: curX, y: curY, angle });

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        onFinishVehicleSimulation();
      }
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isSimulatingVehicle, routeResult, nodes, onFinishVehicleSimulation]);

  const getNodeIcon = (type: CityNode['type']) => {
    switch (type) {
      case 'trauma_center':
      case 'hospital':
        return <Activity className="w-4 h-4 text-rose-500" />;
      case 'fire_station':
        return <Flame className="w-4 h-4 text-orange-500" />;
      case 'shelter':
        return <Home className="w-4 h-4 text-emerald-600" />;
      case 'power_grid':
        return <Zap className="w-4 h-4 text-amber-500" />;
      case 'depot':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'incident':
        return <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse" />;
      default:
        return <Compass className="w-3 h-3 text-slate-400" />;
    }
  };

  return (
    <div
      className={`relative w-full h-[580px] rounded-2xl border transition-colors duration-200 overflow-hidden select-none shadow-md ${
        isDark
          ? 'bg-[#0a0f1d] border-slate-800'
          : 'bg-[#f8fafc] border-slate-200'
      }`}
    >
      {/* Background blueprint grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <defs>
          <pattern id="city-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={isDark ? '#1e293b' : '#e2e8f0'}
              strokeWidth="0.8"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#city-grid)" />
      </svg>

      {/* Main Interactive SVG Canvas */}
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* River Water Gradient */}
          <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            {isDark ? (
              <>
                <stop offset="0%" stopColor="#0369a1" stopOpacity="0.45" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#075985" stopOpacity="0.5" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.75" />
                <stop offset="50%" stopColor="#7dd3fc" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.6" />
              </>
            )}
          </linearGradient>

          {/* Active Route Glow */}
          <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Metro Canal Waterway */}
        <path
          d="M 0,220 C 200,210 320,290 490,260 C 650,230 780,290 1000,280 L 1000,320 C 780,330 650,270 490,300 C 320,330 200,250 0,260 Z"
          fill="url(#riverGradient)"
          className="pointer-events-none"
        />
        <text
          x="80"
          y="245"
          fill={isDark ? '#38bdf8' : '#0369a1'}
          opacity={isDark ? 0.6 : 0.8}
          fontSize="11"
          fontWeight="bold"
          fontFamily="monospace"
          className="tracking-widest"
        >
          ≈ METRO CANAL WATERWAY (HAZARD DIVIDER) ≈
        </text>

        {/* Road Edges */}
        <g id="edges">
          {edges.map(edge => {
            const u = nodes.find(n => n.id === edge.from);
            const v = nodes.find(n => n.id === edge.to);
            if (!u || !v) return null;

            const isBlocked = edge.isBlocked;
            const isRouteEdge =
              activePathEdges.has(edge.id) ||
              (currentStep?.relaxedEdgeIds && currentStep.relaxedEdgeIds.includes(edge.id));
            const isExamining = currentStep?.examinedEdgeId === edge.id;
            const isBottleneck =
              selectedAlgorithm === 'maxflow' && maxFlowResult?.bottleneckEdgeIds.includes(edge.id);
            const isMstEdge = selectedAlgorithm === 'kruskal' && mstResult?.mstEdgeIds.includes(edge.id);

            // Determine stroke color and width
            let strokeColor = isDark ? '#475569' : '#64748b';
            let strokeWidth = edge.type === 'highway' ? 5 : edge.type === 'bridge' ? 4.5 : 3.5;
            let strokeDasharray: string | undefined = undefined;

            if (isBlocked) {
              strokeColor = '#ef4444'; // Red blocked
              strokeDasharray = '7,5';
              strokeWidth = 4.5;
            } else if (edge.floodRisk === 'severe') {
              strokeColor = isDark ? '#0284c7' : '#0284c7';
              strokeDasharray = '5,4';
            } else if (edge.traffic === 'gridlock') {
              strokeColor = '#ea580c'; // Red-orange
            } else if (edge.traffic === 'heavy') {
              strokeColor = '#d97706'; // Amber
            }

            if (isMstEdge) {
              strokeColor = '#f59e0b'; // Gold MST
              strokeWidth = 5.5;
            } else if (isBottleneck) {
              strokeColor = '#ec4899'; // Pink Choke point
              strokeWidth = 6;
            } else if (isRouteEdge) {
              strokeColor = isDark ? '#10b981' : '#059669'; // Vivid green route
              strokeWidth = 6;
            } else if (isExamining) {
              strokeColor = '#38bdf8'; // Blue examine
              strokeWidth = 5;
            }

            const midX = (u.x + v.x) / 2;
            const midY = (u.y + v.y) / 2;

            return (
              <g
                key={edge.id}
                className="cursor-pointer group"
                onClick={() => setSelectedEdgeForEdit(edge)}
                onMouseEnter={() => setHoveredEdge(edge)}
                onMouseLeave={() => setHoveredEdge(null)}
              >
                {/* Thick hit area */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke="transparent"
                  strokeWidth="24"
                />

                {/* Outer Glow on Active Routes */}
                {(isRouteEdge || isMstEdge || isBottleneck) && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth + 5}
                    strokeOpacity={isDark ? 0.45 : 0.25}
                    filter="url(#routeGlow)"
                  />
                )}

                {/* Primary Road Line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />

                {/* Moving Dash Pulse for Chosen Route */}
                {isRouteEdge && !isBlocked && (
                  <line
                    x1={u.x}
                    y1={u.y}
                    x2={v.x}
                    y2={v.y}
                    stroke="#ffffff"
                    strokeWidth={strokeWidth * 0.35}
                    strokeDasharray="8,10"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                )}

                {/* Blocked Hazard Marker */}
                {isBlocked && (
                  <g transform={`translate(${midX}, ${midY})`}>
                    <circle
                      r="10"
                      fill="#ef4444"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      ✕
                    </text>
                  </g>
                )}

                {/* Flood Risk Marker */}
                {!isBlocked && edge.floodRisk !== 'none' && (
                  <g transform={`translate(${midX - 8}, ${midY - 8})`}>
                    <rect
                      width="16"
                      height="16"
                      rx="3"
                      fill={isDark ? '#0c4a6e' : '#e0f2fe'}
                      stroke="#0284c7"
                      strokeWidth="1.5"
                    />
                    <text
                      x="8"
                      y="11.5"
                      textAnchor="middle"
                      fill="#0284c7"
                      fontSize="11"
                      fontWeight="bold"
                    >
                      ~
                    </text>
                  </g>
                )}

                {/* Distance Label on Hover */}
                {hoveredEdge?.id === edge.id && (
                  <g transform={`translate(${midX}, ${midY - 14})`}>
                    <rect
                      x="-36"
                      y="-12"
                      width="72"
                      height="19"
                      rx="4"
                      fill={isDark ? '#0f172a' : '#ffffff'}
                      stroke={isDark ? '#475569' : '#cbd5e1'}
                      strokeWidth="1.5"
                      className="shadow-md"
                    />
                    <text
                      x="0"
                      y="2"
                      textAnchor="middle"
                      fill={isDark ? '#f8fafc' : '#0f172a'}
                      fontSize="10"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {edge.distanceKm} km
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g id="nodes">
          {nodes.map(node => {
            const isStart = node.id === startNodeId;
            const isEnd = node.id === endNodeId;
            const isVisited = visitedNodes.has(node.id);
            const isFrontier = frontierNodes.has(node.id);
            const isCurrent = currentStep?.currentNodeId === node.id;
            const isPath = activePathNodes.has(node.id);

            let nodeFill = isDark ? '#111827' : '#ffffff';
            let strokeColor = isDark ? '#64748b' : '#94a3b8';
            let radius = 19;

            if (isStart) {
              nodeFill = isDark ? '#064e3b' : '#ecfdf5';
              strokeColor = '#10b981';
              radius = 22;
            } else if (isEnd) {
              nodeFill = isDark ? '#7f1d1d' : '#fff1f2';
              strokeColor = '#f43f5e';
              radius = 22;
            } else if (isCurrent) {
              nodeFill = isDark ? '#1e3a8a' : '#eff6ff';
              strokeColor = '#3b82f6';
              radius = 22;
            } else if (isPath) {
              nodeFill = isDark ? '#065f46' : '#ecfdf5';
              strokeColor = '#10b981';
            } else if (isFrontier) {
              nodeFill = isDark ? '#451a03' : '#fffbeb';
              strokeColor = '#f59e0b';
            } else if (isVisited) {
              nodeFill = isDark ? '#1f2937' : '#f1f5f9';
              strokeColor = isDark ? '#94a3b8' : '#64748b';
            } else if (node.type === 'incident') {
              nodeFill = isDark ? '#450a0a' : '#fef2f2';
              strokeColor = '#ef4444';
              radius = 22;
            }

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={e => {
                  if (e.shiftKey) {
                    onSelectNode(node.id, 'end');
                  } else {
                    onSelectNode(node.id, 'start');
                  }
                }}
              >
                {/* Outer ping beacon */}
                {(isStart || isEnd || node.type === 'incident' || isCurrent) && (
                  <circle
                    r={radius + 7}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    strokeOpacity="0.4"
                    className="animate-ping"
                  />
                )}

                {/* Base Node Circle */}
                <circle
                  r={radius}
                  fill={nodeFill}
                  stroke={strokeColor}
                  strokeWidth={isStart || isEnd || isCurrent ? 3 : 2}
                  className="transition-all duration-200 shadow-sm"
                />

                {/* Inner Icon */}
                <foreignObject
                  x={-radius + 4}
                  y={-radius + 4}
                  width={(radius - 4) * 2}
                  height={(radius - 4) * 2}
                  className="pointer-events-none"
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {getNodeIcon(node.type)}
                  </div>
                </foreignObject>

                {/* Start / Target Badges Above */}
                {isStart && (
                  <g transform={`translate(0, ${-radius - 8})`}>
                    <rect
                      x="-24"
                      y="-11"
                      width="48"
                      height="16"
                      rx="4"
                      fill="#059669"
                    />
                    <text
                      y="1"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      ORIGIN
                    </text>
                  </g>
                )}

                {isEnd && (
                  <g transform={`translate(0, ${-radius - 8})`}>
                    <rect
                      x="-25"
                      y="-11"
                      width="50"
                      height="16"
                      rx="4"
                      fill="#e11d48"
                    />
                    <text
                      y="1"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                    >
                      TARGET
                    </text>
                  </g>
                )}

                {/* Node Label Below */}
                <text
                  y={radius + 14}
                  textAnchor="middle"
                  fill={isDark ? '#f1f5f9' : '#0f172a'}
                  fontSize="11"
                  fontWeight="bold"
                  className="pointer-events-none"
                >
                  {node.name.length > 20 ? node.name.substring(0, 18) + '...' : node.name}
                </text>
                <text
                  y={radius + 25}
                  textAnchor="middle"
                  fill={isDark ? '#94a3b8' : '#64748b'}
                  fontSize="9.5"
                  fontFamily="monospace"
                  className="pointer-events-none"
                >
                  [{node.id}] {node.capacity ? `Cap: ${node.availableCapacity ?? node.capacity}` : ''}
                </text>
              </g>
            );
          })}
        </g>

        {/* Animated Emergency Vehicle */}
        {vehiclePosition && (
          <g
            transform={`translate(${vehiclePosition.x}, ${vehiclePosition.y}) rotate(${vehiclePosition.angle})`}
          >
            <circle
              r="24"
              fill="#ef4444"
              fillOpacity="0.3"
              className="animate-ping"
            />
            <rect
              x="-15"
              y="-9"
              width="30"
              height="18"
              rx="4"
              fill="#dc2626"
              stroke="#ffffff"
              strokeWidth="2"
            />
            <rect
              x="4"
              y="-6"
              width="6"
              height="12"
              rx="1.5"
              fill="#67e8f9"
            />
            <circle
              cx="-2"
              cy="0"
              r="4"
              fill="#38bdf8"
              stroke="#ffffff"
              strokeWidth="1.5"
              className="animate-pulse"
            />
          </g>
        )}
      </svg>

      {/* Map Legend */}
      <div
        className={`absolute top-3 right-3 flex items-center gap-3 px-3.5 py-2 rounded-xl border text-xs font-mono backdrop-blur-md shadow-sm ${
          isDark
            ? 'bg-slate-900/90 border-slate-700 text-slate-200'
            : 'bg-white/95 border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Origin</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span>Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-red-500 border-dashed border-t"></span>
          <span>Blocked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-1 bg-sky-500"></span>
          <span>Flood</span>
        </div>
      </div>

      {/* Node Tooltip */}
      {hoveredNode && (
        <div
          className={`absolute bottom-3 left-3 p-3.5 rounded-xl border shadow-xl text-xs max-w-xs pointer-events-none backdrop-blur-md ${
            isDark
              ? 'bg-slate-900/95 border-slate-700 text-slate-200'
              : 'bg-white/95 border-slate-300 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-bold text-sm">{hoveredNode.name}</span>
            <span className="font-mono text-slate-400">ID: {hoveredNode.id}</span>
          </div>
          <p className="capitalize text-slate-400 mb-1">Type: {hoveredNode.type.replace('_', ' ')}</p>
          {hoveredNode.capacity !== undefined && (
            <p className="font-mono">
              Available: <span className="text-emerald-500 font-bold">{hoveredNode.availableCapacity ?? hoveredNode.capacity}</span> / {hoveredNode.capacity}
            </p>
          )}
          <p className="text-[10px] text-slate-400 mt-1 italic">
            Click to set Origin · Shift+Click to set Target
          </p>
        </div>
      )}

      {/* Road Segment Modifier Modal */}
      {selectedEdgeForEdit && (
        <div
          className={`absolute top-3 left-3 p-4 rounded-xl border shadow-2xl text-xs max-w-sm backdrop-blur-md ${
            isDark
              ? 'bg-slate-900/95 border-slate-700 text-slate-200'
              : 'bg-white/95 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-bold text-sm">Road Segment [{selectedEdgeForEdit.id}]</span>
              <p className="text-[11px] text-slate-400">
                {selectedEdgeForEdit.from} ↔ {selectedEdgeForEdit.to} ({selectedEdgeForEdit.distanceKm} km, {selectedEdgeForEdit.speedLimitKmh} km/h)
              </p>
            </div>
            <button
              onClick={() => setSelectedEdgeForEdit(null)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-medium">Hazard Blockage:</span>
              <button
                onClick={() => {
                  onToggleEdgeBlockage(selectedEdgeForEdit.id);
                  setSelectedEdgeForEdit(prev => prev ? { ...prev, isBlocked: !prev.isBlocked } : null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selectedEdgeForEdit.isBlocked
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                <Ban className="w-3.5 h-3.5" />
                {selectedEdgeForEdit.isBlocked ? 'BLOCKED' : 'PASSABLE'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Traffic Congestion:</span>
              <button
                onClick={() => {
                  onCycleEdgeTraffic(selectedEdgeForEdit.id);
                  const levels: RoadEdge['traffic'][] = ['clear', 'moderate', 'heavy', 'gridlock'];
                  const curIdx = levels.indexOf(selectedEdgeForEdit.traffic);
                  const next = levels[(curIdx + 1) % levels.length];
                  setSelectedEdgeForEdit(prev => prev ? { ...prev, traffic: next } : null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-200 dark:bg-slate-800 text-amber-600 dark:text-amber-300 hover:bg-slate-300 dark:hover:bg-slate-700 capitalize cursor-pointer"
              >
                {selectedEdgeForEdit.traffic}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-medium">Flood Inundation:</span>
              <button
                onClick={() => {
                  onCycleEdgeFlood(selectedEdgeForEdit.id);
                  const risks: RoadEdge['floodRisk'][] = ['none', 'moderate', 'severe'];
                  const curIdx = risks.indexOf(selectedEdgeForEdit.floodRisk);
                  const next = risks[(curIdx + 1) % risks.length];
                  setSelectedEdgeForEdit(prev => prev ? { ...prev, floodRisk: next } : null);
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-slate-200 dark:bg-slate-800 text-sky-600 dark:text-sky-400 hover:bg-slate-300 dark:hover:bg-slate-700 capitalize cursor-pointer"
              >
                {selectedEdgeForEdit.floodRisk}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
