import { CityNode, RoadEdge, VehicleConfig, RouteResult, AlgorithmStep } from '../types';

export function calculateEdgeEffectiveTime(edge: RoadEdge, vehicle: VehicleConfig): number | null {
  // If road is completely blocked, impassable
  if (edge.isBlocked) return null;

  // Flood passability check
  if (vehicle.maxFloodPassable === 'none' && edge.floodRisk !== 'none') return null;
  if (vehicle.maxFloodPassable === 'moderate' && edge.floodRisk === 'severe') return null;

  const baseSpeed = edge.speedLimitKmh * vehicle.speedMultiplier;
  const baseMinutes = (edge.distanceKm / Math.max(baseSpeed, 10)) * 60;

  // Traffic congestion penalty
  let trafficFactor = 1.0;
  if (edge.traffic === 'moderate') trafficFactor = 1.35;
  if (edge.traffic === 'heavy') trafficFactor = 1.85;
  if (edge.traffic === 'gridlock') trafficFactor = 3.2;

  // Emergency sirens / privilege reduces delay
  const sirenMitigatedFactor = 1.0 + (trafficFactor - 1.0) * (1.0 - vehicle.sirenClearanceBonus);

  // Flood hazard delay multiplier
  let floodMultiplier = 1.0;
  if (edge.floodRisk === 'moderate') floodMultiplier = 1.5;
  if (edge.floodRisk === 'severe') floodMultiplier = 2.4;

  return baseMinutes * sirenMitigatedFactor * floodMultiplier;
}

export function runDijkstra(
  nodes: CityNode[],
  edges: RoadEdge[],
  startNodeId: string,
  endNodeId: string,
  vehicle: VehicleConfig
): RouteResult {
  const steps: AlgorithmStep[] = [];
  const nodeMap = new Map<string, CityNode>(nodes.map(n => [n.id, n]));
  
  // Adjacency list: node -> array of { neighborId, edgeId, edge, travelTime }
  const adj = new Map<string, { neighborId: string; edge: RoadEdge; cost: number }[]>();
  for (const n of nodes) {
    adj.set(n.id, []);
  }

  for (const e of edges) {
    const cost = calculateEdgeEffectiveTime(e, vehicle);
    if (cost !== null) {
      adj.get(e.from)?.push({ neighborId: e.to, edge: e, cost });
      adj.get(e.to)?.push({ neighborId: e.from, edge: e, cost }); // bidirectional roads
    }
  }

  const dist = new Map<string, number>();
  const prevNode = new Map<string, string>();
  const prevEdge = new Map<string, string>();
  const visited = new Set<string>();

  for (const n of nodes) {
    dist.set(n.id, Infinity);
  }
  dist.set(startNodeId, 0);

  // Min-Heap simulated priority queue
  interface HeapItem {
    nodeId: string;
    priority: number;
  }
  const minHeap: HeapItem[] = [{ nodeId: startNodeId, priority: 0 }];

  let stepCount = 0;
  let edgesRelaxedCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Initialized Dijkstra Min-Priority Queue with source ${nodeMap.get(startNodeId)?.name || startNodeId} at cost 0.0 min.`,
    currentNodeId: startNodeId,
    visitedNodeIds: [],
    frontierNodeIds: [startNodeId],
    pathSoFarNodeIds: [startNodeId],
    heapState: [{ node: startNodeId, priority: 0, label: 'Cost: 0.0m' }],
    metricNotes: `Vehicle: ${vehicle.name} | Siren Clearance: ${(vehicle.sirenClearanceBonus * 100).toFixed(0)}%`,
  });

  while (minHeap.length > 0) {
    // Extract min
    minHeap.sort((a, b) => a.priority - b.priority);
    const { nodeId: u, priority: currentDist } = minHeap.shift()!;

    if (visited.has(u)) continue;
    visited.add(u);

    // Reconstruct path to u for visualization
    const currentPath: string[] = [];
    let curr: string | undefined = u;
    while (curr) {
      currentPath.unshift(curr);
      curr = prevNode.get(curr);
    }

    steps.push({
      stepNumber: ++stepCount,
      description: `Extracted vertex ${nodeMap.get(u)?.name || u} with min cost ${currentDist.toFixed(1)} mins from heap.`,
      currentNodeId: u,
      visitedNodeIds: Array.from(visited),
      frontierNodeIds: minHeap.map(h => h.nodeId),
      pathSoFarNodeIds: currentPath,
      heapState: minHeap.map(h => ({
        node: h.nodeId,
        priority: h.priority,
        label: `${h.priority.toFixed(1)}m`,
      })),
      metricNotes: `Target: ${nodeMap.get(endNodeId)?.name || endNodeId} | Visited count: ${visited.size}/${nodes.length}`,
    });

    if (u === endNodeId) {
      steps.push({
        stepNumber: ++stepCount,
        description: `Target ${nodeMap.get(endNodeId)?.name || endNodeId} reached with optimal emergency route!`,
        currentNodeId: u,
        visitedNodeIds: Array.from(visited),
        frontierNodeIds: [],
        pathSoFarNodeIds: currentPath,
        heapState: [],
        metricNotes: `Final Total ETA: ${currentDist.toFixed(1)} mins`,
      });
      break;
    }

    const neighbors = adj.get(u) || [];
    const relaxedThisRound: string[] = [];

    for (const { neighborId: v, edge, cost } of neighbors) {
      if (visited.has(v)) continue;

      const alt = currentDist + cost;
      if (alt < (dist.get(v) ?? Infinity)) {
        dist.set(v, alt);
        prevNode.set(v, u);
        prevEdge.set(v, edge.id);
        edgesRelaxedCount++;
        relaxedThisRound.push(edge.id);

        // Push / update in heap
        minHeap.push({ nodeId: v, priority: alt });

        steps.push({
          stepNumber: ++stepCount,
          description: `Relaxed edge ${edge.id} (${nodeMap.get(u)?.name?.split(' ')[0]} -> ${nodeMap.get(v)?.name?.split(' ')[0]}): new tentative cost = ${alt.toFixed(1)} mins.`,
          currentNodeId: u,
          examinedEdgeId: edge.id,
          relaxedEdgeIds: [edge.id],
          visitedNodeIds: Array.from(visited),
          frontierNodeIds: minHeap.map(h => h.nodeId),
          pathSoFarNodeIds: currentPath,
          heapState: minHeap.map(h => ({
            node: h.nodeId,
            priority: h.priority,
            label: `${h.priority.toFixed(1)}m`,
          })),
          metricNotes: `Edge: ${edge.type} | Dist: ${edge.distanceKm}km | Traffic: ${edge.traffic}`,
        });
      }
    }
  }

  // Final path reconstruction
  const finalPathNodes: string[] = [];
  const finalPathEdges: string[] = [];
  let at: string | undefined = endNodeId;

  if (dist.get(endNodeId) !== Infinity) {
    while (at) {
      finalPathNodes.unshift(at);
      const edgeId = prevEdge.get(at);
      if (edgeId) finalPathEdges.unshift(edgeId);
      at = prevNode.get(at);
    }
  }

  // Calculate total physical distance
  let totalDistanceKm = 0;
  for (const eId of finalPathEdges) {
    const e = edges.find(edge => edge.id === eId);
    if (e) totalDistanceKm += e.distanceKm;
  }

  const finalCost = dist.get(endNodeId);
  const estimatedTimeMinutes = finalCost !== undefined && finalCost !== Infinity ? finalCost : 0;

  // Calculate safety score (100 minus flood risk and traffic delays)
  let hazardDeductions = 0;
  for (const eId of finalPathEdges) {
    const e = edges.find(edge => edge.id === eId);
    if (e) {
      if (e.floodRisk === 'moderate') hazardDeductions += 15;
      if (e.floodRisk === 'severe') hazardDeductions += 35;
      if (e.traffic === 'heavy') hazardDeductions += 10;
      if (e.traffic === 'gridlock') hazardDeductions += 25;
    }
  }
  const safetyScore = Math.max(10, Math.min(100, 100 - hazardDeductions));

  return {
    pathNodeIds: finalPathNodes,
    pathEdgeIds: finalPathEdges,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    estimatedTimeMinutes: Number(estimatedTimeMinutes.toFixed(1)),
    safetyScore,
    nodesVisitedCount: visited.size,
    edgesRelaxedCount,
    steps,
  };
}
