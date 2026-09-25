package com.emergency.planner.algo;

import com.emergency.planner.ds.Graph;
import com.emergency.planner.model.*;

import java.util.*;

/**
 * Edmonds-Karp Maximum Flow Algorithm (BFS implementation of Ford-Fulkerson).
 * Time Complexity: O(V * E^2)
 *
 * Finds the maximum civilian vehicle throughput from disaster danger zones to safe shelters,
 * and pinpoints min-cut bottleneck bridges and corridors.
 */
public class MaxFlowEvacuation {

    public static MaxFlowResult computeMaxEvacuationFlow(
            Graph graph,
            String sourceId,
            String sinkId
    ) {
        List<Node> nodeList = new ArrayList<>(graph.getAllNodes());
        int n = nodeList.size();
        Map<String, Integer> idToIndex = new HashMap<>();
        Map<Integer, String> indexToId = new HashMap<>();

        for (int i = 0; i < n; i++) {
            idToIndex.put(nodeList.get(i).getId(), i);
            indexToId.put(i, nodeList.get(i).getId());
        }

        int s = idToIndex.getOrDefault(sourceId, -1);
        int t = idToIndex.getOrDefault(sinkId, -1);
        if (s == -1 || t == -1 || s == t) {
            return new MaxFlowResult(0, Collections.emptyList());
        }

        int[][] capacity = new int[n][n];
        int[][] residual = new int[n][n];
        List<Integer>[] adj = new ArrayList[n];
        for (int i = 0; i < n; i++) adj[i] = new ArrayList<>();

        for (RoadEdge edge : graph.getAllEdges()) {
            Integer u = idToIndex.get(edge.getFrom());
            Integer v = idToIndex.get(edge.getTo());
            if (u != null && v != null && !edge.isBlocked()) {
                int cap = edge.getCapacityVehiclesPerHour();
                // Adjust capacity based on traffic and weather
                if (edge.getTraffic() == TrafficLevel.HEAVY) cap = (int)(cap * 0.6);
                if (edge.getTraffic() == TrafficLevel.GRIDLOCK) cap = (int)(cap * 0.2);
                if (edge.getFloodRisk() == FloodRisk.MODERATE) cap = (int)(cap * 0.5);
                if (edge.getFloodRisk() == FloodRisk.SEVERE) cap = (int)(cap * 0.1);

                capacity[u][v] += cap;
                capacity[v][u] += cap; // Two-way evacuation corridors
                adj[u].add(v);
                adj[v].add(u);
                residual[u][v] += cap;
                residual[v][u] += cap;
            }
        }

        int maxFlow = 0;

        // BFS to find shortest augmenting path in residual network
        while (true) {
            int[] parent = new int[n];
            Arrays.fill(parent, -1);
            int[] pathFlow = new int[n];
            Queue<Integer> queue = new LinkedList<>();

            queue.add(s);
            parent[s] = s;
            pathFlow[s] = Integer.MAX_VALUE;

            while (!queue.isEmpty()) {
                int u = queue.poll();
                if (u == t) break;

                for (int v : adj[u]) {
                    if (parent[v] == -1 && residual[u][v] > 0) {
                        parent[v] = u;
                        pathFlow[v] = Math.min(pathFlow[u], residual[u][v]);
                        queue.add(v);
                    }
                }
            }

            if (parent[t] == -1) break; // No more augmenting paths

            int flow = pathFlow[t];
            maxFlow += flow;

            int curr = t;
            while (curr != s) {
                int prev = parent[curr];
                residual[prev][curr] -= flow;
                residual[curr][prev] += flow;
                curr = prev;
            }
        }

        // Identify Min-Cut Bottleneck Edges
        boolean[] reachable = new boolean[n];
        Queue<Integer> cutQueue = new LinkedList<>();
        reachable[s] = true;
        cutQueue.add(s);
        while (!cutQueue.isEmpty()) {
            int u = cutQueue.poll();
            for (int v : adj[u]) {
                if (!reachable[v] && residual[u][v] > 0) {
                    reachable[v] = true;
                    cutQueue.add(v);
                }
            }
        }

        List<String> bottleneckEdges = new ArrayList<>();
        for (RoadEdge edge : graph.getAllEdges()) {
            Integer u = idToIndex.get(edge.getFrom());
            Integer v = idToIndex.get(edge.getTo());
            if (u != null && v != null) {
                if ((reachable[u] && !reachable[v] && capacity[u][v] > 0) ||
                    (reachable[v] && !reachable[u] && capacity[v][u] > 0)) {
                    bottleneckEdges.add(edge.getId());
                }
            }
        }

        return new MaxFlowResult(maxFlow, bottleneckEdges);
    }
}
