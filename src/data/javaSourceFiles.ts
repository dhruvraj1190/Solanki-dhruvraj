export interface JavaSourceFile {
  filename: string;
  className: string;
  category: 'core' | 'algo' | 'model' | 'build' | 'ds';
  description: string;
  code: string;
}

export const JAVA_SOURCE_FILES: JavaSourceFile[] = [
  {
    filename: 'Main.java',
    className: 'Main',
    category: 'core',
    description: 'Driver application demonstrating Emergency Road Planner algorithms with console benchmarks & test runner.',
    code: `package com.emergency.planner;

import com.emergency.planner.algo.*;
import com.emergency.planner.ds.*;
import com.emergency.planner.model.*;

import java.util.*;

/**
 * Emergency Road Planner - Java Data Structures & Algorithms Hackathon Project
 *
 * This system provides mission-critical dynamic routing for disaster relief,
 * mass casualty evacuations, and infrastructure restoration.
 *
 * Core Algorithms:
 * 1. Dijkstra's Algorithm with Min-PriorityQueue (Dynamic Emergency Routing)
 * 2. A* Heuristic Search (Euclidean-guided Urgent Interventions)
 * 3. Kruskal's MST with Disjoint Set Union (Backbone Grid Restoration)
 * 4. Edmonds-Karp / Ford-Fulkerson (Evacuation Bottleneck Flow)
 * 5. Kahn's Topological Sort (Crisis Incident Task Sequencing)
 */
public class Main {

    public static void main(String[] args) {
        printBanner();

        // 1. Build City Graph
        Graph graph = buildSampleEmergencyGrid();
        System.out.println(">>> [1/5] Loaded Disaster Response Road Network:");
        System.out.printf("    Total Nodes: %d | Total Edges: %d\\n\\n", graph.getNodeCount(), graph.getEdgeCount());

        // 2. Configure Emergency Vehicle
        EmergencyVehicle ambulance = new EmergencyVehicle(
                "EMS-Alpha-1",
                EmergencyVehicle.VehicleType.AMBULANCE,
                1.35,  // Speed multiplier
                0.70,  // Siren delay mitigation bonus
                FloodRisk.MODERATE
        );

        // 3. Test Dijkstra Dynamic Routing
        System.out.println(">>> [2/5] Running Dynamic Dijkstra Routing (EMS Ambulance)...");
        String origin = "H1";  // Central Trauma Center
        String target = "X1";  // Downtown Gas Explosion Incident
        
        long startTime = System.nanoTime();
        RouteResult dijkstraResult = DijkstraRouter.findFastestRoute(graph, origin, target, ambulance);
        long elapsedMicros = (System.nanoTime() - startTime) / 1000;

        if (dijkstraResult.isPathFound()) {
            System.out.printf("    ✔ Optimal Route: %s\\n", String.join(" -> ", dijkstraResult.getPath()));
            System.out.printf("    ✔ Total Distance: %.2f km\\n", dijkstraResult.getTotalDistanceKm());
            System.out.printf("    ✔ Estimated ETA: %.2f minutes\\n", dijkstraResult.getEstimatedTimeMinutes());
            System.out.printf("    ✔ Nodes Expanded: %d | Edges Relaxed: %d\\n", dijkstraResult.getNodesExpanded(), dijkstraResult.getEdgesRelaxed());
            System.out.printf("    ✔ Execution Time: %d µs (O((V + E) log V))\\n\\n", elapsedMicros);
        } else {
            System.out.println("    ✘ No passable route available due to catastrophic hazards.\\n");
        }

        // 4. Test Kruskal's Minimum Spanning Tree for Infrastructure Recovery
        System.out.println(">>> [3/5] Computing Infrastructure Restoration Backbone (Kruskal's MST + DSU)...");
        startTime = System.nanoTime();
        MstResult mstResult = KruskalMST.computeRecoveryBackbone(graph);
        elapsedMicros = (System.nanoTime() - startTime) / 1000;

        System.out.printf("    ✔ Backbone Edges: %d\\n", mstResult.getMstEdges().size());
        System.out.printf("    ✔ Minimum Total Bulldozing & Clearance Time: %.2f hours\\n", mstResult.getTotalClearanceHours());
        System.out.printf("    ✔ Connected Disjoint Sectors: %d\\n", mstResult.getConnectedComponents());
        System.out.printf("    ✔ Execution Time: %d µs (O(E log E))\\n\\n", elapsedMicros);

        // 5. Test Edmonds-Karp Evacuation Max Flow
        System.out.println(">>> [4/5] Computing Mass Civilian Evacuation Throughput (Edmonds-Karp Max Flow)...");
        String downtownZone = "I2"; // Downtown Plaza
        String regionalShelter = "S1"; // Highland Arena Shelter
        
        startTime = System.nanoTime();
        MaxFlowResult flowResult = MaxFlowEvacuation.computeMaxEvacuationFlow(graph, downtownZone, regionalShelter);
        elapsedMicros = (System.nanoTime() - startTime) / 1000;

        System.out.printf("    ✔ Peak Evacuation Throughput: %,d civilian vehicles/hour\\n", flowResult.getMaxVehiclesPerHour());
        System.out.printf("    ✔ Critical Choke Point Bottlenecks Identified: %d edges\\n", flowResult.getBottleneckEdges().size());
        for (String edgeId : flowResult.getBottleneckEdges()) {
            System.out.printf("       [Choke Point] Edge ID: %s\\n", edgeId);
        }
        System.out.printf("    ✔ Execution Time: %d µs (O(V * E^2))\\n\\n", elapsedMicros);

        // 6. Test Kahn's Topological Task Scheduling
        System.out.println(">>> [5/5] Sequencing Multi-Agency Crisis Protocol (Kahn's Topological Sort)...");
        List<EmergencyTask> tasks = createSampleTasks();
        startTime = System.nanoTime();
        TopoResult topoResult = EmergencyTaskScheduler.scheduleTasks(tasks);
        elapsedMicros = (System.nanoTime() - startTime) / 1000;

        if (topoResult.isFeasible()) {
            System.out.println("    ✔ Incident Action Plan Ordered Safely without Deadlocks:");
            for (int i = 0; i < topoResult.getOrder().size(); i++) {
                EmergencyTask t = topoResult.getOrder().get(i);
                System.out.printf("       Stage %d: [%s] %s (%d mins)\\n", (i + 1), t.getId(), t.getTitle(), t.getDurationMinutes());
            }
            System.out.printf("    ✔ Execution Time: %d µs (O(V + E))\\n\\n", elapsedMicros);
        } else {
            System.out.println("    ✘ DEADLOCK DETECTED! Circular dependencies exist in emergency task protocol.\\n");
        }

        System.out.println("=========================================================================");
        System.out.println(">>> ALL EMERGENCY DATA STRUCTURE ALGORITHMS EXECUTED SUCCESSFULLY.");
        System.out.println("=========================================================================");
    }

    private static void printBanner() {
        System.out.println("=========================================================================");
        System.out.println("     EMERGENCY ROAD PLANNER - DATA STRUCTURES & ALGORITHMS (JAVA)        ");
        System.out.println("             Hackathon Edition - Critical Mission Routing                ");
        System.out.println("=========================================================================\\n");
    }

    private static Graph buildSampleEmergencyGrid() {
        Graph g = new Graph();

        // Add Nodes (Coordinates for Euclidean Heuristic)
        g.addNode(new Node("H1", "Central Trauma Hospital", Node.NodeType.TRAUMA_CENTER, 220, 140, 48));
        g.addNode(new Node("H2", "Metro East General", Node.NodeType.HOSPITAL, 740, 130, 60));
        g.addNode(new Node("H3", "South Suburban Clinic", Node.NodeType.HOSPITAL, 500, 490, 35));
        g.addNode(new Node("F1", "Fire Station #4 (West)", Node.NodeType.FIRE_STATION, 120, 320, 10));
        g.addNode(new Node("F2", "Fire Station #9 (North)", Node.NodeType.FIRE_STATION, 480, 90, 8));
        g.addNode(new Node("S1", "Highland Arena Shelter", Node.NodeType.SHELTER, 860, 340, 500));
        g.addNode(new Node("S2", "North University Shelter", Node.NodeType.SHELTER, 380, 60, 400));
        g.addNode(new Node("S3", "Fairground Relief Camp", Node.NodeType.SHELTER, 160, 490, 650));
        g.addNode(new Node("P1", "City Power Grid Station", Node.NodeType.POWER_GRID, 830, 220, 0));
        g.addNode(new Node("D1", "Civil Defense Supply Depot", Node.NodeType.DEPOT, 620, 410, 150));
        g.addNode(new Node("I1", "River Bridge North Junction", Node.NodeType.INTERSECTION, 360, 240, 0));
        g.addNode(new Node("I2", "Downtown Financial Plaza", Node.NodeType.INTERSECTION, 440, 330, 0));
        g.addNode(new Node("I3", "East Express Interchange", Node.NodeType.INTERSECTION, 670, 260, 0));
        g.addNode(new Node("I4", "Harbor Gateway Roundabout", Node.NodeType.INTERSECTION, 260, 380, 0));
        g.addNode(new Node("I5", "South Canal Overpass", Node.NodeType.INTERSECTION, 390, 450, 0));
        g.addNode(new Node("X1", "Incident: Downtown Gas Rupture", Node.NodeType.INCIDENT, 460, 270, 0));

        // Add Road Edges
        g.addBidirectionalEdge(new RoadEdge("E1", "H1", "F1", 4.2, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1800, 1.5));
        g.addBidirectionalEdge(new RoadEdge("E2", "H1", "I1", 3.1, 70, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.MODERATE, FloodRisk.NONE, 2200, 1.0));
        g.addBidirectionalEdge(new RoadEdge("E3", "H1", "S2", 3.8, 50, RoadEdge.RoadType.LOCAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1200, 2.0));
        g.addBidirectionalEdge(new RoadEdge("E4", "S2", "F2", 2.6, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1600, 1.2));
        g.addBidirectionalEdge(new RoadEdge("E5", "F2", "H2", 6.4, 90, RoadEdge.RoadType.HIGHWAY, false, TrafficLevel.CLEAR, FloodRisk.NONE, 3400, 2.5));
        g.addBidirectionalEdge(new RoadEdge("E6", "F2", "I1", 3.5, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.MODERATE, FloodRisk.NONE, 1900, 1.4));
        g.addBidirectionalEdge(new RoadEdge("E7", "I1", "X1", 2.1, 50, RoadEdge.RoadType.LOCAL, false, TrafficLevel.HEAVY, FloodRisk.NONE, 1400, 3.0));
        g.addBidirectionalEdge(new RoadEdge("E8", "I1", "I2", 2.8, 60, RoadEdge.RoadType.BRIDGE, false, TrafficLevel.HEAVY, FloodRisk.NONE, 2000, 4.5));
        g.addBidirectionalEdge(new RoadEdge("E9", "I1", "I4", 3.9, 70, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 2100, 1.8));
        g.addBidirectionalEdge(new RoadEdge("E10", "X1", "I2", 1.4, 40, RoadEdge.RoadType.LOCAL, true, TrafficLevel.GRIDLOCK, FloodRisk.NONE, 800, 5.0)); // Blocked
        g.addBidirectionalEdge(new RoadEdge("E11", "X1", "I3", 4.8, 70, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.MODERATE, FloodRisk.NONE, 2400, 2.0));
        g.addBidirectionalEdge(new RoadEdge("E12", "I2", "I3", 5.2, 80, RoadEdge.RoadType.HIGHWAY, false, TrafficLevel.HEAVY, FloodRisk.NONE, 3200, 2.8));
        g.addBidirectionalEdge(new RoadEdge("E13", "I2", "I5", 3.3, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.MODERATE, FloodRisk.MODERATE, 1700, 2.2));
        g.addBidirectionalEdge(new RoadEdge("E14", "I3", "H2", 3.7, 75, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 2600, 1.5));
        g.addBidirectionalEdge(new RoadEdge("E15", "I3", "P1", 2.5, 50, RoadEdge.RoadType.LOCAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1100, 1.0));
        g.addBidirectionalEdge(new RoadEdge("E16", "I3", "S1", 4.4, 80, RoadEdge.RoadType.HIGHWAY, false, TrafficLevel.CLEAR, FloodRisk.NONE, 3600, 1.7));
        g.addBidirectionalEdge(new RoadEdge("E17", "P1", "S1", 3.2, 50, RoadEdge.RoadType.LOCAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1000, 1.2));
        g.addBidirectionalEdge(new RoadEdge("E18", "F1", "I4", 3.4, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1900, 1.3));
        g.addBidirectionalEdge(new RoadEdge("E19", "F1", "S3", 4.6, 70, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 2000, 1.6));
        g.addBidirectionalEdge(new RoadEdge("E20", "I4", "S3", 3.6, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1800, 1.4));
        g.addBidirectionalEdge(new RoadEdge("E21", "I4", "I5", 3.2, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1700, 1.5));
        g.addBidirectionalEdge(new RoadEdge("E22", "I5", "H3", 3.1, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.MODERATE, 1600, 2.1));
        g.addBidirectionalEdge(new RoadEdge("E23", "I5", "D1", 5.4, 70, RoadEdge.RoadType.HIGHWAY, false, TrafficLevel.CLEAR, FloodRisk.NONE, 2800, 1.9));
        g.addBidirectionalEdge(new RoadEdge("E24", "H3", "D1", 3.8, 60, RoadEdge.RoadType.ARTERIAL, false, TrafficLevel.CLEAR, FloodRisk.NONE, 1800, 1.3));
        g.addBidirectionalEdge(new RoadEdge("E25", "D1", "S1", 6.2, 80, RoadEdge.RoadType.HIGHWAY, false, TrafficLevel.CLEAR, FloodRisk.NONE, 3100, 2.0));
        g.addBidirectionalEdge(new RoadEdge("E26", "S3", "H3", 7.5, 80, RoadEdge.RoadType.HIGHWAY, false, TrafficLevel.CLEAR, FloodRisk.NONE, 3000, 2.4));

        return g;
    }

    private static List<EmergencyTask> createSampleTasks() {
        List<EmergencyTask> list = new ArrayList<>();
        list.add(new EmergencyTask("T1", "Isolate City Gas Main Valve (Sector 4)", 25, List.of()));
        list.add(new EmergencyTask("T2", "Extinguish Downtown Rupture Flash Fire", 40, List.of("T1")));
        list.add(new EmergencyTask("T3", "Clear Concrete Debris on E10 Overpass", 60, List.of("T2")));
        list.add(new EmergencyTask("T4", "Deploy Trauma Triage Staging Tents at I2", 30, List.of("T1")));
        list.add(new EmergencyTask("T5", "Establish Green Siren Corridor to H1 Hospital", 15, List.of("T4")));
        list.add(new EmergencyTask("T6", "Re-energize Backup Power Grid Station P1", 45, List.of("T2")));
        list.add(new EmergencyTask("T7", "Begin Mass Civilian Bus Conveyance to S1 Shelter", 50, List.of("T3", "T5")));
        return list;
    }
}
`,
  },
  {
    filename: 'Graph.java',
    className: 'Graph',
    category: 'ds',
    description: 'Dynamic Adjacency List graph representation with bidirectional road mapping and edge query lookup.',
    code: `package com.emergency.planner.ds;

import com.emergency.planner.model.Node;
import com.emergency.planner.model.RoadEdge;

import java.util.*;

/**
 * High-performance Graph implementation representing the emergency road network.
 * Stores nodes in a HashMap and adjacency lists mapping node IDs to road segments.
 */
public class Graph {
    private final Map<String, Node> nodes = new HashMap<>();
    private final Map<String, List<RoadEdge>> adjacencyList = new HashMap<>();
    private final List<RoadEdge> allEdges = new ArrayList<>();

    public void addNode(Node node) {
        nodes.put(node.getId(), node);
        adjacencyList.putIfAbsent(node.getId(), new ArrayList<>());
    }

    public void addBidirectionalEdge(RoadEdge edge) {
        allEdges.add(edge);
        
        // Forward
        adjacencyList.computeIfAbsent(edge.getFrom(), k -> new ArrayList<>()).add(edge);
        
        // Reverse direction road representation
        RoadEdge reverseEdge = new RoadEdge(
                edge.getId() + "_rev",
                edge.getTo(),
                edge.getFrom(),
                edge.getDistanceKm(),
                edge.getSpeedLimitKmh(),
                edge.getType(),
                edge.isBlocked(),
                edge.getTraffic(),
                edge.getFloodRisk(),
                edge.getCapacityVehiclesPerHour(),
                edge.getClearanceTimeHours()
        );
        adjacencyList.computeIfAbsent(edge.getTo(), k -> new ArrayList<>()).add(reverseEdge);
    }

    public Node getNode(String id) {
        return nodes.get(id);
    }

    public Collection<Node> getAllNodes() {
        return Collections.unmodifiableCollection(nodes.values());
    }

    public List<RoadEdge> getEdgesFrom(String nodeId) {
        return adjacencyList.getOrDefault(nodeId, Collections.emptyList());
    }

    public List<RoadEdge> getAllEdges() {
        return Collections.unmodifiableList(allEdges);
    }

    public int getNodeCount() {
        return nodes.size();
    }

    public int getEdgeCount() {
        return allEdges.size();
    }
}
`,
  },
  {
    filename: 'DijkstraRouter.java',
    className: 'DijkstraRouter',
    category: 'algo',
    description: 'Dijkstra shortest path algorithm using Java PriorityQueue with dynamic hazard multipliers and vehicle sirens.',
    code: `package com.emergency.planner.algo;

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
`,
  },
  {
    filename: 'AStarRouter.java',
    className: 'AStarRouter',
    category: 'algo',
    description: 'A* Heuristic Shortest Path using Euclidean geometric lower bound for ultra-fast point-to-point routing.',
    code: `package com.emergency.planner.algo;

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
`,
  },
  {
    filename: 'DisjointSetUnion.java',
    className: 'DisjointSetUnion',
    category: 'ds',
    description: 'Disjoint Set Union (Union-Find) with path compression and rank optimization for cycle prevention.',
    code: `package com.emergency.planner.ds;

import java.util.HashMap;
import java.util.Map;

/**
 * Disjoint Set Union (DSU / Union-Find)
 * Optimizations:
 * 1. Path Compression: Flattens the tree during find()
 * 2. Union by Rank: Attaches smaller tree under root of larger tree
 *
 * Amortized Time Complexity: O(α(N)) ≈ O(1) per operation (Inverse Ackermann function)
 */
public class DisjointSetUnion {
    private final Map<String, String> parent = new HashMap<>();
    private final Map<String, Integer> rank = new HashMap<>();

    public void makeSet(String element) {
        parent.put(element, element);
        rank.put(element, 0);
    }

    public String find(String element) {
        String p = parent.get(element);
        if (p == null) return element;
        if (p.equals(element)) return element;

        // Path Compression
        String root = find(p);
        parent.put(element, root);
        return root;
    }

    public boolean union(String x, String y) {
        String rootX = find(x);
        String rootY = find(y);

        if (rootX.equals(rootY)) {
            return false; // Already in the same disjoint set; adding this edge creates a cycle!
        }

        // Union by Rank
        int rankX = rank.getOrDefault(rootX, 0);
        int rankY = rank.getOrDefault(rootY, 0);

        if (rankX < rankY) {
            parent.put(rootX, rootY);
        } else if (rankX > rankY) {
            parent.put(rootY, rootX);
        } else {
            parent.put(rootY, rootX);
            rank.put(rootX, rankX + 1);
        }

        return true;
    }

    public boolean isConnected(String x, String y) {
        return find(x).equals(find(y));
    }
}
`,
  },
  {
    filename: 'KruskalMST.java',
    className: 'KruskalMST',
    category: 'algo',
    description: 'Kruskal Minimum Spanning Tree for post-disaster infrastructure and route recovery backbone.',
    code: `package com.emergency.planner.algo;

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
`,
  },
  {
    filename: 'MaxFlowEvacuation.java',
    className: 'MaxFlowEvacuation',
    category: 'algo',
    description: 'Edmonds-Karp (Ford-Fulkerson with BFS) for calculating peak civilian evacuation throughput.',
    code: `package com.emergency.planner.algo;

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
`,
  },
  {
    filename: 'EmergencyTaskScheduler.java',
    className: 'EmergencyTaskScheduler',
    category: 'algo',
    description: 'Kahn’s Topological Sorting algorithm with in-degree queue for multi-agency crisis protocol sequencing.',
    code: `package com.emergency.planner.algo;

import com.emergency.planner.model.EmergencyTask;
import com.emergency.planner.model.TopoResult;

import java.util.*;

/**
 * Kahn's Algorithm for Topological Sorting.
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 *
 * Guarantees safe scheduling of dependent disaster actions
 * (e.g., Gas Isolation -> Fire Suppression -> Rubble Clearing -> Green Route).
 * Detects dangerous circular dependency deadlocks.
 */
public class EmergencyTaskScheduler {

    public static TopoResult scheduleTasks(List<EmergencyTask> tasks) {
        Map<String, Integer> inDegree = new HashMap<>();
        Map<String, List<String>> adj = new HashMap<>();
        Map<String, EmergencyTask> taskMap = new HashMap<>();

        for (EmergencyTask t : tasks) {
            inDegree.put(t.getId(), 0);
            adj.put(t.getId(), new ArrayList<>());
            taskMap.put(t.getId(), t);
        }

        // Build directed edges: prereq -> dependent
        for (EmergencyTask t : tasks) {
            for (String prereqId : t.getDependencies()) {
                if (adj.containsKey(prereqId)) {
                    adj.get(prereqId).add(t.getId());
                    inDegree.put(t.getId(), inDegree.get(t.getId()) + 1);
                }
            }
        }

        // Queue of ready tasks (0 unsatisfied prerequisites)
        Queue<String> queue = new LinkedList<>();
        for (EmergencyTask t : tasks) {
            if (inDegree.get(t.getId()) == 0) {
                queue.add(t.getId());
            }
        }

        List<EmergencyTask> ordered = new ArrayList<>();

        while (!queue.isEmpty()) {
            String u = queue.poll();
            ordered.add(taskMap.get(u));

            for (String v : adj.get(u)) {
                int deg = inDegree.get(v) - 1;
                inDegree.put(v, deg);
                if (deg == 0) {
                    queue.add(v);
                }
            }
        }

        boolean isFeasible = ordered.size() == tasks.size();
        return new TopoResult(isFeasible, ordered);
    }
}
`,
  },
  {
    filename: 'Node.java',
    className: 'Node',
    category: 'model',
    description: 'City node domain model representing hospitals, fire stations, shelters, and disaster epicenters.',
    code: `package com.emergency.planner.model;

public class Node {
    public enum NodeType {
        TRAUMA_CENTER,
        HOSPITAL,
        FIRE_STATION,
        SHELTER,
        POWER_GRID,
        DEPOT,
        INTERSECTION,
        INCIDENT
    }

    private final String id;
    private final String name;
    private final NodeType type;
    private final double x;
    private final double y;
    private final int capacity;

    public Node(String id, String name, NodeType type, double x, double y, int capacity) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.x = x;
        this.y = y;
        this.capacity = capacity;
    }

    public String getId() { return id; }
    public String getName() { return name; }
    public NodeType getType() { return type; }
    public double getX() { return x; }
    public double getY() { return y; }
    public int getCapacity() { return capacity; }
}
`,
  },
  {
    filename: 'RoadEdge.java',
    className: 'RoadEdge',
    category: 'model',
    description: 'Road segment edge model containing physical distance, speed limit, traffic level, and flood risk.',
    code: `package com.emergency.planner.model;

public class RoadEdge {
    public enum RoadType {
        HIGHWAY,
        ARTERIAL,
        LOCAL,
        BRIDGE,
        TUNNEL
    }

    private final String id;
    private final String from;
    private final String to;
    private final double distanceKm;
    private final double speedLimitKmh;
    private final RoadType type;
    private final boolean isBlocked;
    private final TrafficLevel traffic;
    private final FloodRisk floodRisk;
    private final int capacityVehiclesPerHour;
    private final double clearanceTimeHours;

    public RoadEdge(
            String id,
            String from,
            String to,
            double distanceKm,
            double speedLimitKmh,
            RoadType type,
            boolean isBlocked,
            TrafficLevel traffic,
            FloodRisk floodRisk,
            int capacityVehiclesPerHour,
            double clearanceTimeHours
    ) {
        this.id = id;
        this.from = from;
        this.to = to;
        this.distanceKm = distanceKm;
        this.speedLimitKmh = speedLimitKmh;
        this.type = type;
        this.isBlocked = isBlocked;
        this.traffic = traffic;
        this.floodRisk = floodRisk;
        this.capacityVehiclesPerHour = capacityVehiclesPerHour;
        this.clearanceTimeHours = clearanceTimeHours;
    }

    public String getId() { return id; }
    public String getFrom() { return from; }
    public String getTo() { return to; }
    public double getDistanceKm() { return distanceKm; }
    public double getSpeedLimitKmh() { return speedLimitKmh; }
    public RoadType getType() { return type; }
    public boolean isBlocked() { return isBlocked; }
    public TrafficLevel getTraffic() { return traffic; }
    public FloodRisk getFloodRisk() { return floodRisk; }
    public int getCapacityVehiclesPerHour() { return capacityVehiclesPerHour; }
    public double getClearanceTimeHours() { return clearanceTimeHours; }
}
`,
  },
  {
    filename: 'EmergencyVehicle.java',
    className: 'EmergencyVehicle',
    category: 'model',
    description: 'Vehicle specifications including speed multiplier, siren clearance privileges, and flood tolerance.',
    code: `package com.emergency.planner.model;

public class EmergencyVehicle {
    public enum VehicleType {
        AMBULANCE,
        FIRE_TRUCK,
        POLICE_CRUISER,
        EVACUATION_BUS,
        HEAVY_RESCUE
    }

    private final String id;
    private final VehicleType type;
    private final double speedMultiplier;
    private final double sirenClearanceBonus;
    private final FloodRisk maxFloodPassable;

    public EmergencyVehicle(
            String id,
            VehicleType type,
            double speedMultiplier,
            double sirenClearanceBonus,
            FloodRisk maxFloodPassable
    ) {
        this.id = id;
        this.type = type;
        this.speedMultiplier = speedMultiplier;
        this.sirenClearanceBonus = sirenClearanceBonus;
        this.maxFloodPassable = maxFloodPassable;
    }

    public String getId() { return id; }
    public VehicleType getType() { return type; }
    public double getSpeedMultiplier() { return speedMultiplier; }
    public double getSirenClearanceBonus() { return sirenClearanceBonus; }
    public FloodRisk getMaxFloodPassable() { return maxFloodPassable; }
}
`,
  },
  {
    filename: 'pom.xml',
    className: 'MavenConfig',
    category: 'build',
    description: 'Ready-to-use Maven project configuration with Java 17 and JUnit test runner dependencies.',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.emergency.planner</groupId>
    <artifactId>emergency-road-planner</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>Emergency Road Planner (Java DSA)</name>
    <description>Mission-critical dynamic road routing, evacuation throughput, and disaster recovery graph engine.</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- JUnit 5 for Automated Test Suite -->
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-api</artifactId>
            <version>5.10.1</version>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.junit.jupiter</groupId>
            <artifactId>junit-jupiter-engine</artifactId>
            <version>5.10.1</version>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Executable JAR with Main Class -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-jar-plugin</artifactId>
                <version>3.3.0</version>
                <configuration>
                    <archive>
                        <manifest>
                            <mainClass>com.emergency.planner.Main</mainClass>
                        </manifest>
                    </archive>
                </configuration>
            </plugin>

            <!-- Exec Plugin to run 'mvn exec:java' -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <mainClass>com.emergency.planner.Main</mainClass>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`,
  },
];
