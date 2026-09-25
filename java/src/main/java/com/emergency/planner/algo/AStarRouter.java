package com.emergency.planner.algo;

import com.emergency.planner.ds.Graph;
import com.emergency.planner.model.*;

import java.util.*;

/**
 * A* (A-Star) Search Algorithm.
 * Uses Euclidean Distance heuristic divided by maximum vehicle velocity.
 * Guaranteeing optimality while expanding far fewer nodes than standard Dijkstra.
 */
public class AStarRouter {

    public static class AStarEntry implements Comparable<AStarEntry> {
        public final String nodeId;
        public final double fScore; // gScore + heuristic

        public AStarEntry(String nodeId, double fScore) {
            this.nodeId = nodeId;
            this.fScore = fScore;
        }

        @Override
        public int compareTo(AStarEntry o) {
            return Double.compare(this.fScore, o.fScore);
        }
    }

    public static RouteResult findAStarRoute(
            Graph graph,
            String sourceId,
            String targetId,
            EmergencyVehicle vehicle
    ) {
        Node targetNode = graph.getNode(targetId);
        if (targetNode == null) return new RouteResult(false, List.of(), 0, 0, 0, 0);

        Map<String, Double> gScore = new HashMap<>();
        Map<String, Double> fScore = new HashMap<>();
        Map<String, String> cameFrom = new HashMap<>();
        Set<String> closedSet = new HashSet<>();

        for (Node n : graph.getAllNodes()) {
            gScore.put(n.getId(), Double.POSITIVE_INFINITY);
            fScore.put(n.getId(), Double.POSITIVE_INFINITY);
        }

        gScore.put(sourceId, 0.0);
        double initialH = calculateHeuristic(graph.getNode(sourceId), targetNode, vehicle);
        fScore.put(sourceId, initialH);

        PriorityQueue<AStarEntry> openSet = new PriorityQueue<>();
        openSet.add(new AStarEntry(sourceId, initialH));

        int nodesExpanded = 0;
        int edgesRelaxed = 0;

        while (!openSet.isEmpty()) {
            AStarEntry current = openSet.poll();
            String u = current.nodeId;

            if (u.equals(targetId)) {
                // Goal reached
                LinkedList<String> path = new LinkedList<>();
                String curr = targetId;
                while (curr != null) {
                    path.addFirst(curr);
                    curr = cameFrom.get(curr);
                }
                return new RouteResult(true, path, 0.0, gScore.get(targetId), nodesExpanded, edgesRelaxed);
            }

            if (closedSet.contains(u)) continue;
            closedSet.add(u);
            nodesExpanded++;

            for (RoadEdge edge : graph.getEdgesFrom(u)) {
                String v = edge.getTo();
                if (closedSet.contains(v)) continue;

                Double edgeTime = DijkstraRouter.calculateEffectiveTravelTime(edge, vehicle);
                if (edgeTime == null) continue;

                double tentativeG = gScore.get(u) + edgeTime;
                if (tentativeG < gScore.get(v)) {
                    cameFrom.put(v, u);
                    gScore.put(v, tentativeG);
                    double h = calculateHeuristic(graph.getNode(v), targetNode, vehicle);
                    double f = tentativeG + h;
                    fScore.put(v, f);
                    edgesRelaxed++;
                    openSet.add(new AStarEntry(v, f));
                }
            }
        }

        return new RouteResult(false, List.of(), 0, 0, nodesExpanded, edgesRelaxed);
    }

    private static double calculateHeuristic(Node from, Node to, EmergencyVehicle vehicle) {
        if (from == null || to == null) return 0.0;
        double dx = from.getX() - to.getX();
        double dy = from.getY() - to.getY();
        double pixelDistance = Math.sqrt(dx * dx + dy * dy);
        double kmEstimate = (pixelDistance / 100.0) * 1.5;
        double maxVelocityKmh = 90.0 * vehicle.getSpeedMultiplier();
        return (kmEstimate / maxVelocityKmh) * 60.0; // lower bound estimated travel minutes
    }
}
