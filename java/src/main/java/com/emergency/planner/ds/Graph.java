package com.emergency.planner.ds;

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
