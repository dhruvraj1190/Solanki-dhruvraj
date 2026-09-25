export type NodeType = 'hospital' | 'trauma_center' | 'fire_station' | 'shelter' | 'incident' | 'intersection' | 'power_grid' | 'depot';

export interface CityNode {
  id: string;
  name: string;
  type: NodeType;
  x: number; // 0 - 1000 coordinate space
  y: number; // 0 - 600 coordinate space
  capacity?: number; // e.g. ICU beds or shelter capacity
  availableCapacity?: number;
  priorityScore?: number; // for emergency triage
}

export type RoadType = 'highway' | 'arterial' | 'local' | 'bridge' | 'tunnel';
export type FloodRisk = 'none' | 'moderate' | 'severe';
export type TrafficLevel = 'clear' | 'moderate' | 'heavy' | 'gridlock';

export interface RoadEdge {
  id: string;
  from: string;
  to: string;
  distanceKm: number;
  speedLimitKmh: number;
  type: RoadType;
  isBlocked: boolean;
  blockageReason?: string;
  traffic: TrafficLevel;
  floodRisk: FloodRisk;
  capacityVehiclesPerHour: number; // For Max Flow
  clearanceTimeHours: number; // For MST recovery cost
}

export type EmergencyVehicleType = 'ambulance' | 'fire_truck' | 'police_cruiser' | 'evacuation_bus' | 'heavy_rescue';

export interface VehicleConfig {
  type: EmergencyVehicleType;
  name: string;
  speedMultiplier: number;
  sirenClearanceBonus: number; // reduces traffic penalty
  maxFloodPassable: FloodRisk;
  icon: string;
}

export type AlgorithmType = 'dijkstra' | 'astar' | 'kruskal' | 'maxflow' | 'toposort';

export interface AlgorithmStep {
  stepNumber: number;
  description: string;
  currentNodeId?: string;
  examinedEdgeId?: string;
  relaxedEdgeIds?: string[];
  visitedNodeIds: string[];
  frontierNodeIds: string[]; // nodes currently in min-heap / queue
  pathSoFarNodeIds: string[];
  heapState?: { node: string; priority: number; label: string }[];
  dsuState?: { element: string; parent: string; rank: number }[];
  flowAugmentingPath?: string[];
  currentBottleneck?: number;
  metricNotes?: string;
}

export interface RouteResult {
  pathNodeIds: string[];
  pathEdgeIds: string[];
  totalDistanceKm: number;
  estimatedTimeMinutes: number;
  safetyScore: number; // 0 - 100
  nodesVisitedCount: number;
  edgesRelaxedCount: number;
  steps: AlgorithmStep[];
}

export interface MstResult {
  mstEdgeIds: string[];
  totalClearanceHours: number;
  totalDistanceKm: number;
  steps: AlgorithmStep[];
  connectedComponents: number;
}

export interface MaxFlowResult {
  maxVehiclesPerHour: number;
  bottleneckEdgeIds: string[];
  steps: AlgorithmStep[];
  residualFlows: { [edgeId: string]: number };
}

export interface EmergencyTask {
  id: string;
  title: string;
  category: 'hazard_containment' | 'debris_clearance' | 'medical_triage' | 'evacuation_corridor' | 'utility_restore';
  durationMinutes: number;
  dependencies: string[]; // prerequisite task IDs
  status: 'pending' | 'in_progress' | 'completed';
}

export interface TopoSortResult {
  orderedTaskIds: string[];
  hasCycle: boolean;
  cycleNodes?: string[];
  levels: { level: number; taskIds: string[] }[];
  steps: AlgorithmStep[];
}
