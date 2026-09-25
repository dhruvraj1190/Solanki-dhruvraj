package com.emergency.planner;

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
        System.out.printf("    Total Nodes: %d | Total Edges: %d\n\n", graph.getNodeCount(), graph.getEdgeCount());

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
            System.out.printf("    ✔ Optimal Route: %s\n", String.join(" -> ", dijkstraResult.getPath()));
            System.out.printf("    ✔ Total Distance: %.2f km\n", dijkstraResult.getTotalDistanceKm());
            System.out.printf("    ✔ Estimated ETA: %.2f minutes\n", dijkstraResult.getEstimatedTimeMinutes());
            System.out.printf("    ✔ Nodes Expanded: %d | Edges Relaxed: %d\n", dijkstraResult.getNodesExpanded(), dijkstraResult.getEdgesRelaxed());
            System.out.printf("    ✔ Execution Time: %d µs (O((V + E) log V))\n\n", elapsedMicros);
        } else {
            System.out.println("    ✘ No passable route available due to catastrophic hazards.\n");
        }

        // 4. Test Kruskal's Minimum Spanning Tree for Infrastructure Recovery
        System.out.println(">>> [3/5] Computing Infrastructure Restoration Backbone (Kruskal's MST + DSU)...");
        startTime = System.nanoTime();
        MstResult mstResult = KruskalMST.computeRecoveryBackbone(graph);
        elapsedMicros = (System.nanoTime() - startTime) / 1000;

        System.out.printf("    ✔ Backbone Edges: %d\n", mstResult.getMstEdges().size());
        System.out.printf("    ✔ Minimum Total Bulldozing & Clearance Time: %.2f hours\n", mstResult.getTotalClearanceHours());
        System.out.printf("    ✔ Connected Disjoint Sectors: %d\n", mstResult.getConnectedComponents());
        System.out.printf("    ✔ Execution Time: %d µs (O(E log E))\n\n", elapsedMicros);

        // 5. Test Edmonds-Karp Evacuation Max Flow
        System.out.println(">>> [4/5] Computing Mass Civilian Evacuation Throughput (Edmonds-Karp Max Flow)...");
        String downtownZone = "I2"; // Downtown Plaza
        String regionalShelter = "S1"; // Highland Arena Shelter
        
        startTime = System.nanoTime();
        MaxFlowResult flowResult = MaxFlowEvacuation.computeMaxEvacuationFlow(graph, downtownZone, regionalShelter);
        elapsedMicros = (System.nanoTime() - startTime) / 1000;

        System.out.printf("    ✔ Peak Evacuation Throughput: %,d civilian vehicles/hour\n", flowResult.getMaxVehiclesPerHour());
        System.out.printf("    ✔ Critical Choke Point Bottlenecks Identified: %d edges\n", flowResult.getBottleneckEdges().size());
        for (String edgeId : flowResult.getBottleneckEdges()) {
            System.out.printf("       [Choke Point] Edge ID: %s\n", edgeId);
        }
        System.out.printf("    ✔ Execution Time: %d µs (O(V * E^2))\n\n", elapsedMicros);

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
                System.out.printf("       Stage %d: [%s] %s (%d mins)\n", (i + 1), t.getId(), t.getTitle(), t.getDurationMinutes());
            }
            System.out.printf("    ✔ Execution Time: %d µs (O(V + E))\n\n", elapsedMicros);
        } else {
            System.out.println("    ✘ DEADLOCK DETECTED! Circular dependencies exist in emergency task protocol.\n");
        }

        System.out.println("=========================================================================");
        System.out.println(">>> ALL EMERGENCY DATA STRUCTURE ALGORITHMS EXECUTED SUCCESSFULLY.");
        System.out.println("=========================================================================");
    }

    private static void printBanner() {
        System.out.println("=========================================================================");
        System.out.println("     EMERGENCY ROAD PLANNER - DATA STRUCTURES & ALGORITHMS (JAVA)        ");
        System.out.println("             Hackathon Edition - Critical Mission Routing                ");
        System.out.println("=========================================================================\n");
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
