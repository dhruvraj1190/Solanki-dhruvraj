package com.emergency.planner.model;

import java.util.List;

public class RouteResult {
    private final boolean pathFound;
    private final List<String> path;
    private final double totalDistanceKm;
    private final double estimatedTimeMinutes;
    private final int nodesExpanded;
    private final int edgesRelaxed;

    public RouteResult(
            boolean pathFound,
            List<String> path,
            double totalDistanceKm,
            double estimatedTimeMinutes,
            int nodesExpanded,
            int edgesRelaxed
    ) {
        this.pathFound = pathFound;
        this.path = path;
        this.totalDistanceKm = totalDistanceKm;
        this.estimatedTimeMinutes = estimatedTimeMinutes;
        this.nodesExpanded = nodesExpanded;
        this.edgesRelaxed = edgesRelaxed;
    }

    public boolean isPathFound() { return pathFound; }
    public List<String> getPath() { return path; }
    public double getTotalDistanceKm() { return totalDistanceKm; }
    public double getEstimatedTimeMinutes() { return estimatedTimeMinutes; }
    public int getNodesExpanded() { return nodesExpanded; }
    public int getEdgesRelaxed() { return edgesRelaxed; }
}
