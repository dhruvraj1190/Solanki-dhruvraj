package com.emergency.planner.algo;

import com.emergency.planner.ds.DisjointSetUnion;
import com.emergency.planner.ds.Graph;
import com.emergency.planner.model.MstResult;
import com.emergency.planner.model.Node;
import com.emergency.planner.model.RoadEdge;

import java.util.*;

/**
 * Kruskal's Minimum Spanning Tree Algorithm.
 * Used to identify the minimum-cost, minimum-clearing-time critical road backbone
 * ensuring all emergency hospitals, fire stations, and supply depots are connected.
 *
 * Time Complexity: O(E log E)
 * Space Complexity: O(V + E)
 */
public class KruskalMST {

    public static MstResult computeRecoveryBackbone(Graph graph) {
        DisjointSetUnion dsu = new DisjointSetUnion();
        for (Node n : graph.getAllNodes()) {
            dsu.makeSet(n.getId());
        }

        // Collect and sort unique edges by clearance time (hours)
        List<RoadEdge> sortedEdges = new ArrayList<>(graph.getAllEdges());
        sortedEdges.sort(Comparator.comparingDouble(RoadEdge::getClearanceTimeHours));

        List<RoadEdge> mst = new ArrayList<>();
        double totalClearanceHours = 0.0;
        int totalNodes = graph.getNodeCount();

        for (RoadEdge edge : sortedEdges) {
            String rootFrom = dsu.find(edge.getFrom());
            String rootTo = dsu.find(edge.getTo());

            if (!rootFrom.equals(rootTo)) {
                // Safe to include edge - does not create cycle
                dsu.union(edge.getFrom(), edge.getTo());
                mst.add(edge);
                totalClearanceHours += edge.getClearanceTimeHours();

                if (mst.size() == totalNodes - 1) {
                    break; // Spanning tree complete
                }
            }
        }

        // Count disconnected isolated components if any
        Set<String> uniqueRoots = new HashSet<>();
        for (Node n : graph.getAllNodes()) {
            uniqueRoots.add(dsu.find(n.getId()));
        }

        return new MstResult(mst, totalClearanceHours, uniqueRoots.size());
    }
}
