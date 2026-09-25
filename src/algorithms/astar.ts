import { CityNode, RoadEdge, VehicleConfig, RouteResult, AlgorithmStep } from '../types';
import { calculateEdgeEffectiveTime } from './dijkstra';

export function runAStar(
  nodes: CityNode[],
  edges: RoadEdge[],
  startNodeId: string,
  endNodeId: string,
  vehicle: VehicleConfig
): RouteResult {
  const steps: AlgorithmStep[] = [];
  const nodeMap = new Map<string, CityNode>(nodes.map(n => [n.id, n]));
  const targetNode = nodeMap.get(endNodeId);

  // Adjacency list
  const adj = new Map<string, { neighborId: string; edge: RoadEdge; cost: number }[]>();
  for (const n of nodes) adj.set(n.id, []);

  for (const e of edges) {
    const cost = calculateEdgeEffectiveTime(e, vehicle);
    if (cost !== null) {
      adj.get(e.from)?.push({ neighborId: e.to, edge: e, cost });
      adj.get(e.to)?.push({ neighborId: e.from, edge: e, cost });
    }
  }

  // Heuristic function: Euclidean coordinate distance scaled to estimated minutes
  const heuristic = (nodeId: string): number => {
    if (!targetNode) return 0;
    const node = nodeMap.get(nodeId);
    if (!node) return 0;
    const dx = (node.x - targetNode.x);
    const dy = (node.y - targetNode.y);
    const pixelDist = Math.sqrt(dx * dx + dy * dy);
    // 100 pixels ≈ 1.5 km
    const kmEstimate = (pixelDist / 100) * 1.5;
    // max possible speed 90 km/h with vehicle bonus
    const maxSpeedKmh = 90 * vehicle.speedMultiplier;
    return (kmEstimate / maxSpeedKmh) * 60; // optimistic lower bound heuristic
  };

  const gScore = new Map<string, number>();
  const fScore = new Map<string, number>();
  const cameFrom = new Map<string, string>();
  const cameFromEdge = new Map<string, string>();
  const openSet = new Set<string>([startNodeId]);
  const closedSet = new Set<string>();

  for (const n of nodes) {
    gScore.set(n.id, Infinity);
    fScore.set(n.id, Infinity);
  }
  gScore.set(startNodeId, 0);
  fScore.set(startNodeId, heuristic(startNodeId));

  let stepCount = 0;
  let edgesRelaxedCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `A* Search Initialized at ${nodeMap.get(startNodeId)?.name || startNodeId} with h(n) = ${heuristic(startNodeId).toFixed(1)}m.`,
    currentNodeId: startNodeId,
    visitedNodeIds: [],
    frontierNodeIds: [startNodeId],
    pathSoFarNodeIds: [startNodeId],
    heapState: [{ node: startNodeId, priority: fScore.get(startNodeId)!, label: `f=${fScore.get(startNodeId)!.toFixed(1)}m (g=0+h)` }],
    metricNotes: `Heuristic: Admissible Euclidean Distance lower bound`,
  });

  while (openSet.size > 0) {
    // Find node in openSet with lowest fScore
    let current: string | null = null;
    let lowestF = Infinity;
    for (const nodeId of openSet) {
      const f = fScore.get(nodeId) ?? Infinity;
      if (f < lowestF) {
        lowestF = f;
        current = nodeId;
      }
    }

    if (!current) break;

    // Reconstruct current tentative path
    const currentPath: string[] = [];
    let p: string | undefined = current;
    while (p) {
      currentPath.unshift(p);
      p = cameFrom.get(p);
    }

    if (current === endNodeId) {
      closedSet.add(current);
      openSet.delete(current);
      steps.push({
        stepNumber: ++stepCount,
        description: `Target ${nodeMap.get(endNodeId)?.name || endNodeId} achieved! A* found guaranteed shortest path with fewer node expansions.`,
        currentNodeId: current,
        visitedNodeIds: Array.from(closedSet),
        frontierNodeIds: Array.from(openSet),
        pathSoFarNodeIds: currentPath,
        metricNotes: `Final Total ETA: ${gScore.get(endNodeId)!.toFixed(1)} mins`,
      });
      break;
    }

    openSet.delete(current);
    closedSet.add(current);

    steps.push({
      stepNumber: ++stepCount,
      description: `Evaluating lowest f-score node ${nodeMap.get(current)?.name || current}: g=${gScore.get(current)!.toFixed(1)}m, h=${heuristic(current).toFixed(1)}m, f=${lowestF.toFixed(1)}m.`,
      currentNodeId: current,
      visitedNodeIds: Array.from(closedSet),
      frontierNodeIds: Array.from(openSet),
      pathSoFarNodeIds: currentPath,
      heapState: Array.from(openSet).map(n => ({
        node: n,
        priority: fScore.get(n)!,
        label: `f=${fScore.get(n)!.toFixed(1)}m`,
      })),
      metricNotes: `OpenSet size: ${openSet.size} | ClosedSet size: ${closedSet.size}`,
    });

    const neighbors = adj.get(current) || [];
    for (const { neighborId: neighbor, edge, cost } of neighbors) {
      if (closedSet.has(neighbor)) continue;

      const tentativeG = (gScore.get(current) ?? Infinity) + cost;

      if (tentativeG < (gScore.get(neighbor) ?? Infinity)) {
        cameFrom.set(neighbor, current);
        cameFromEdge.set(neighbor, edge.id);
        gScore.set(neighbor, tentativeG);
        const h = heuristic(neighbor);
        const f = tentativeG + h;
        fScore.set(neighbor, f);
        edgesRelaxedCount++;

        if (!openSet.has(neighbor)) {
          openSet.add(neighbor);
        }

        steps.push({
          stepNumber: ++stepCount,
          description: `Updated neighbor ${nodeMap.get(neighbor)?.name || neighbor} via edge ${edge.id}: g=${tentativeG.toFixed(1)}m + h=${h.toFixed(1)}m = f=${f.toFixed(1)}m.`,
          currentNodeId: current,
          examinedEdgeId: edge.id,
          relaxedEdgeIds: [edge.id],
          visitedNodeIds: Array.from(closedSet),
          frontierNodeIds: Array.from(openSet),
          pathSoFarNodeIds: currentPath,
          heapState: Array.from(openSet).map(n => ({
            node: n,
            priority: fScore.get(n)!,
            label: `f=${fScore.get(n)!.toFixed(1)}m`,
          })),
        });
      }
    }
  }

  // Final path reconstruction
  const finalPathNodes: string[] = [];
  const finalPathEdges: string[] = [];
  let at: string | undefined = endNodeId;

  if (gScore.get(endNodeId) !== Infinity) {
    while (at) {
      finalPathNodes.unshift(at);
      const edgeId = cameFromEdge.get(at);
      if (edgeId) finalPathEdges.unshift(edgeId);
      at = cameFrom.get(at);
    }
  }

  let totalDistanceKm = 0;
  for (const eId of finalPathEdges) {
    const e = edges.find(edge => edge.id === eId);
    if (e) totalDistanceKm += e.distanceKm;
  }

  const finalCost = gScore.get(endNodeId);
  const estimatedTimeMinutes = finalCost !== undefined && finalCost !== Infinity ? finalCost : 0;

  return {
    pathNodeIds: finalPathNodes,
    pathEdgeIds: finalPathEdges,
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    estimatedTimeMinutes: Number(estimatedTimeMinutes.toFixed(1)),
    safetyScore: 90,
    nodesVisitedCount: closedSet.size,
    edgesRelaxedCount,
    steps,
  };
}
