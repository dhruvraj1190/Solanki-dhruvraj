package com.emergency.planner.algo;

import com.emergency.planner.ds.Graph;
import com.emergency.planner.model.*;

import java.util.*;

/**
 * Dynamic Dijkstra's Algorithm with Min-PriorityQueue.
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V)
 */
public class DijkstraRouter {

    public static class QueueEntry implements Comparable<QueueEntry> {
        public final String nodeId;
        public final double costMinutes;

        public QueueEntry(String nodeId, double costMinutes) {
            this.nodeId = nodeId;
            this.costMinutes = costMinutes;
        }

        @Override
        public int compareTo(QueueEntry other) {
            return Double.compare(this.costMinutes, other.costMinutes);
        }
    }

    public static RouteResult findFastestRoute(
            Graph graph,
            String sourceId,
            String targetId,
            EmergencyVehicle vehicle
    ) {
        Map<String, Double> dist = new HashMap<>();
        Map<String, String> prevNode = new HashMap<>();
        Map<String, String> prevEdge = new HashMap<>();
        Set<String> visited = new HashSet<>();

        for (Node n : graph.getAllNodes()) {
            dist.put(n.getId(), Double.POSITIVE_INFINITY);
        }
        dist.put(sourceId, 0.0);

        PriorityQueue<QueueEntry> minHeap = new PriorityQueue<>();
        minHeap.add(new QueueEntry(sourceId, 0.0));

        int nodesExpanded = 0;
        int edgesRelaxed = 0;

        while (!minHeap.isEmpty()) {
            QueueEntry current = minHeap.poll();
            String u = current.nodeId;

            if (visited.contains(u)) continue;
            visited.add(u);
            nodesExpanded++;

            if (u.equals(targetId)) {
                break; // Target reached
            }

            for (RoadEdge edge : graph.getEdgesFrom(u)) {
                String v = edge.getTo();
                if (visited.contains(v)) continue;

                Double edgeTime = calculateEffectiveTravelTime(edge, vehicle);
                if (edgeTime == null) continue; // Impassable road or flood exceeds limit

                double tentative = dist.get(u) + edgeTime;
                if (tentative < dist.get(v)) {
                    dist.put(v, tentative);
                    prevNode.put(v, u);
                    prevEdge.put(v, edge.getId());
                    edgesRelaxed++;
                    minHeap.add(new QueueEntry(v, tentative));
                }
            }
        }

        if (!dist.containsKey(targetId) || dist.get(targetId) == Double.POSITIVE_INFINITY) {
            return new RouteResult(false, Collections.emptyList(), 0.0, 0.0, nodesExpanded, edgesRelaxed);
        }

        // Reconstruct path
        LinkedList<String> path = new LinkedList<>();
        String curr = targetId;
        double totalDistance = 0.0;

        while (curr != null) {
            path.addFirst(curr);
            curr = prevNode.get(curr);
        }

        return new RouteResult(true, path, totalDistance, dist.get(targetId), nodesExpanded, edgesRelaxed);
    }

    public static Double calculateEffectiveTravelTime(RoadEdge edge, EmergencyVehicle vehicle) {
        if (edge.isBlocked()) return null;

        // Flood safety check
        if (vehicle.getMaxFloodPassable() == FloodRisk.NONE && edge.getFloodRisk() != FloodRisk.NONE) return null;
        if (vehicle.getMaxFloodPassable() == FloodRisk.MODERATE && edge.getFloodRisk() == FloodRisk.SEVERE) return null;

        double baseSpeed = edge.getSpeedLimitKmh() * vehicle.getSpeedMultiplier();
        double travelMinutes = (edge.getDistanceKm() / Math.max(baseSpeed, 10.0)) * 60.0;

        // Traffic multiplier
        double trafficPenalty = switch (edge.getTraffic()) {
            case CLEAR -> 1.0;
            case MODERATE -> 1.35;
            case HEAVY -> 1.85;
            case GRIDLOCK -> 3.20;
        };

        // Siren privilege reduces congestion delay
        double mitigatedTraffic = 1.0 + (trafficPenalty - 1.0) * (1.0 - vehicle.getSirenClearanceBonus());

        // Flood hazard multiplier
        double floodPenalty = switch (edge.getFloodRisk()) {
            case NONE -> 1.0;
            case MODERATE -> 1.5;
            case SEVERE -> 2.4;
        };

        return travelMinutes * mitigatedTraffic * floodPenalty;
    }
}
