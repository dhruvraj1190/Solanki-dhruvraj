package com.emergency.planner.model;

import java.util.List;

public class MstResult {
    private final List<RoadEdge> mstEdges;
    private final double totalClearanceHours;
    private final int connectedComponents;

    public MstResult(List<RoadEdge> mstEdges, double totalClearanceHours, int connectedComponents) {
        this.mstEdges = mstEdges;
        this.totalClearanceHours = totalClearanceHours;
        this.connectedComponents = connectedComponents;
    }

    public List<RoadEdge> getMstEdges() { return mstEdges; }
    public double getTotalClearanceHours() { return totalClearanceHours; }
    public int getConnectedComponents() { return connectedComponents; }
}
