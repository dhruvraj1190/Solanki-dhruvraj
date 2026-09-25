import { CityNode, RoadEdge, MstResult, AlgorithmStep } from '../types';

export class DisjointSetUnion {
  parent: Map<string, string>;
  rank: Map<string, number>;

  constructor(elements: string[]) {
    this.parent = new Map();
    this.rank = new Map();
    for (const elem of elements) {
      this.parent.set(elem, elem);
      this.rank.set(elem, 0);
    }
  }

  find(i: string): string {
    const p = this.parent.get(i);
    if (p === undefined) return i;
    if (p === i) return i;
    // Path compression
    const root = this.find(p);
    this.parent.set(i, root);
    return root;
  }

  union(i: string, j: string): boolean {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) {
      return false; // already in same set, union would create a cycle!
    }

    // Union by rank
    const rankI = this.rank.get(rootI) || 0;
    const rankJ = this.rank.get(rootJ) || 0;

    if (rankI < rankJ) {
      this.parent.set(rootI, rootJ);
    } else if (rankI > rankJ) {
      this.parent.set(rootJ, rootI);
    } else {
      this.parent.set(rootJ, rootI);
      this.rank.set(rootI, rankI + 1);
    }

    return true;
  }

  getStateSnapshot(elements: string[]) {
    return elements.map(e => ({
      element: e,
      parent: this.find(e),
      rank: this.rank.get(e) || 0,
    }));
  }
}

export function runKruskalMST(nodes: CityNode[], edges: RoadEdge[]): MstResult {
  const steps: AlgorithmStep[] = [];
  const nodeIds = nodes.map(n => n.id);
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const dsu = new DisjointSetUnion(nodeIds);

  // Filter out completely blocked impassable roads or use clearance time as edge weight
  const sortedEdges = [...edges].sort((a, b) => {
    // Sort by clearance time (hours) or distance
    return a.clearanceTimeHours - b.clearanceTimeHours;
  });

  const mstEdges: RoadEdge[] = [];
  let stepCount = 0;
  let totalClearanceHours = 0;
  let totalDistanceKm = 0;

  steps.push({
    stepNumber: ++stepCount,
    description: `Kruskal MST Initialized. Sorted all ${sortedEdges.length} city road segments in ascending order of clearance/restoration time.`,
    visitedNodeIds: [],
    frontierNodeIds: [],
    pathSoFarNodeIds: [],
    dsuState: dsu.getStateSnapshot(nodeIds),
    metricNotes: `Target: Form critical backbone network connecting ${nodes.length} emergency installations without cycles.`,
  });

  for (const edge of sortedEdges) {
    const rootU = dsu.find(edge.from);
    const rootV = dsu.find(edge.to);

    const fromName = nodeMap.get(edge.from)?.name?.split(' ')[0] || edge.from;
    const toName = nodeMap.get(edge.to)?.name?.split(' ')[0] || edge.to;

    if (rootU !== rootV) {
      // Valid edge! Connects two separate components
      dsu.union(edge.from, edge.to);
      mstEdges.push(edge);
      totalClearanceHours += edge.clearanceTimeHours;
      totalDistanceKm += edge.distanceKm;

      steps.push({
        stepNumber: ++stepCount,
        description: `ACCEPTED Edge ${edge.id} (${fromName} <-> ${toName}) [${edge.clearanceTimeHours} hrs]. Union performed; disjoint components merged.`,
        examinedEdgeId: edge.id,
        relaxedEdgeIds: mstEdges.map(e => e.id),
        visitedNodeIds: Array.from(new Set(mstEdges.flatMap(e => [e.from, e.to]))),
        frontierNodeIds: [],
        pathSoFarNodeIds: [],
        dsuState: dsu.getStateSnapshot(nodeIds),
        metricNotes: `MST Edges: ${mstEdges.length}/${nodes.length - 1} | Cumulative Time: ${totalClearanceHours.toFixed(1)} hrs`,
      });

      if (mstEdges.length === nodes.length - 1) {
        steps.push({
          stepNumber: ++stepCount,
          description: `Full Minimum Spanning Tree attained! All ${nodes.length} city sectors are connected with minimal restoration effort.`,
          relaxedEdgeIds: mstEdges.map(e => e.id),
          visitedNodeIds: nodeIds,
          frontierNodeIds: [],
          pathSoFarNodeIds: [],
          dsuState: dsu.getStateSnapshot(nodeIds),
          metricNotes: `Final Backbone: ${mstEdges.length} edges | ${totalClearanceHours.toFixed(1)} hrs restoration work`,
        });
        break;
      }
    } else {
      // Cycle detected! Rejected
      steps.push({
        stepNumber: ++stepCount,
        description: `REJECTED Edge ${edge.id} (${fromName} <-> ${toName}) [${edge.clearanceTimeHours} hrs]. Cycle detected (both vertices already share root ${rootU}).`,
        examinedEdgeId: edge.id,
        relaxedEdgeIds: mstEdges.map(e => e.id),
        visitedNodeIds: Array.from(new Set(mstEdges.flatMap(e => [e.from, e.to]))),
        frontierNodeIds: [],
        pathSoFarNodeIds: [],
        dsuState: dsu.getStateSnapshot(nodeIds),
        metricNotes: `Cycle Avoidance: Disjoint Set find(${edge.from}) == find(${edge.to})`,
      });
    }
  }

  // Count connected components
  const uniqueRoots = new Set(nodeIds.map(id => dsu.find(id)));

  return {
    mstEdgeIds: mstEdges.map(e => e.id),
    totalClearanceHours: Number(totalClearanceHours.toFixed(1)),
    totalDistanceKm: Number(totalDistanceKm.toFixed(1)),
    steps,
    connectedComponents: uniqueRoots.size,
  };
}
