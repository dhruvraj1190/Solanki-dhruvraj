import { CityNode, RoadEdge, MaxFlowResult, AlgorithmStep } from '../types';

export function runEdmondsKarpMaxFlow(
  nodes: CityNode[],
  edges: RoadEdge[],
  sourceId: string,
  sinkId: string
): MaxFlowResult {
  const steps: AlgorithmStep[] = [];
  const nodeMap = new Map(nodes.map(n => [n.id, n]));

  // Build capacity matrix and adjacency list
  const nodeIndices = new Map<string, number>();
  const indexToId: string[] = [];
  nodes.forEach((n, idx) => {
    nodeIndices.set(n.id, idx);
    indexToId.push(n.id);
  });

  const n = nodes.length;
  const capacity: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const residual: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const adj: number[][] = Array.from({ length: n }, () => []);

  // Map edge IDs
  const edgeLookup = new Map<string, RoadEdge>();
  for (const edge of edges) {
    edgeLookup.set(`${edge.from}->${edge.to}`, edge);
    edgeLookup.set(`${edge.to}->${edge.from}`, edge);

    const u = nodeIndices.get(edge.from);
    const v = nodeIndices.get(edge.to);
    if (u !== undefined && v !== undefined && !edge.isBlocked) {
      // effective capacity based on traffic & flood
      let cap = edge.capacityVehiclesPerHour;
      if (edge.traffic === 'heavy') cap *= 0.6;
      if (edge.traffic === 'gridlock') cap *= 0.2;
      if (edge.floodRisk === 'moderate') cap *= 0.5;
      if (edge.floodRisk === 'severe') cap *= 0.1;

      capacity[u][v] += Math.round(cap);
      capacity[v][u] += Math.round(cap); // standard two-way city evacuation corridor
      adj[u].push(v);
      adj[v].push(u);
    }
  }

  // Initialize residual capacity
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      residual[i][j] = capacity[i][j];
    }
  }

  const s = nodeIndices.get(sourceId);
  const t = nodeIndices.get(sinkId);

  if (s === undefined || t === undefined || s === t) {
    return {
      maxVehiclesPerHour: 0,
      bottleneckEdgeIds: [],
      steps: [],
      residualFlows: {},
    };
  }

  let maxFlow = 0;
  let stepCount = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Edmonds-Karp Max Flow initialized. Source: ${nodeMap.get(sourceId)?.name || sourceId}, Evacuation Sink: ${nodeMap.get(sinkId)?.name || sinkId}.`,
    visitedNodeIds: [sourceId],
    frontierNodeIds: [],
    pathSoFarNodeIds: [],
    metricNotes: `Objective: Find maximum civilian vehicle throughput (vehicles/hour) across city choke points.`,
  });

  // BFS to find augmenting paths in residual network
  while (true) {
    const parent = Array(n).fill(-1);
    const parentEdgeFlow = Array(n).fill(0);
    const queue: number[] = [s];
    parent[s] = s;
    parentEdgeFlow[s] = Infinity;

    while (queue.length > 0) {
      const u = queue.shift()!;
      if (u === t) break;

      for (const v of adj[u]) {
        if (parent[v] === -1 && residual[u][v] > 0) {
          parent[v] = u;
          parentEdgeFlow[v] = Math.min(parentEdgeFlow[u], residual[u][v]);
          queue.push(v);
        }
      }
    }

    // No augmenting path found
    if (parent[t] === -1) break;

    const pathFlow = parentEdgeFlow[t];
    maxFlow += pathFlow;

    // Reconstruct augmenting path
    const pathNodes: string[] = [];
    let curr = t;
    while (curr !== s) {
      pathNodes.unshift(indexToId[curr]);
      const prev = parent[curr];
      residual[prev][curr] -= pathFlow;
      residual[curr][prev] += pathFlow;
      curr = prev;
    }
    pathNodes.unshift(indexToId[s]);

    steps.push({
      stepNumber: ++stepCount,
      description: `Augmenting path found: ${pathNodes.map(id => nodeMap.get(id)?.name?.split(' ')[0] || id).join(' -> ')}. Pushed +${pathFlow.toLocaleString()} vehicles/hr.`,
      visitedNodeIds: pathNodes,
      frontierNodeIds: [],
      pathSoFarNodeIds: pathNodes,
      flowAugmentingPath: pathNodes,
      currentBottleneck: pathFlow,
      metricNotes: `Total Evacuation Flow: ${maxFlow.toLocaleString()} vehicles/hr`,
    });
  }

  // Find minimum cut (bottleneck edges)
  // Reachable nodes from source in residual graph
  const visited = Array(n).fill(false);
  const q = [s];
  visited[s] = true;
  while (q.length > 0) {
    const u = q.shift()!;
    for (const v of adj[u]) {
      if (!visited[v] && residual[u][v] > 0) {
        visited[v] = true;
        q.push(v);
      }
    }
  }

  const bottleneckEdgeIds: string[] = [];
  const residualFlows: { [edgeId: string]: number } = {};

  for (const edge of edges) {
    const u = nodeIndices.get(edge.from);
    const v = nodeIndices.get(edge.to);
    if (u !== undefined && v !== undefined) {
      // calculate flow sent through this edge
      const flowUV = Math.max(0, capacity[u][v] - residual[u][v]);
      const flowVU = Math.max(0, capacity[v][u] - residual[v][u]);
      const totalEdgeFlow = Math.abs(flowUV - flowVU);
      residualFlows[edge.id] = totalEdgeFlow;

      // Min cut edge crosses from visited to unvisited in original residual
      if ((visited[u] && !visited[v] && capacity[u][v] > 0) || (visited[v] && !visited[u] && capacity[v][u] > 0)) {
        bottleneckEdgeIds.push(edge.id);
      }
    }
  }

  steps.push({
    stepNumber: ++stepCount,
    description: `Max Flow Optimization Complete! Maximum safe throughput is ${maxFlow.toLocaleString()} vehicles/hr. Found ${bottleneckEdgeIds.length} critical choke points.`,
    visitedNodeIds: indexToId.filter((_, idx) => visited[idx]),
    frontierNodeIds: [],
    pathSoFarNodeIds: [],
    relaxedEdgeIds: bottleneckEdgeIds,
    metricNotes: `Max Throughput: ${maxFlow.toLocaleString()} veh/hr | Min-Cut Bottlenecks: ${bottleneckEdgeIds.join(', ')}`,
  });

  return {
    maxVehiclesPerHour: maxFlow,
    bottleneckEdgeIds,
    steps,
    residualFlows,
  };
}
