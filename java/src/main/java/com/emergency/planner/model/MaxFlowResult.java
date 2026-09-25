package com.emergency.planner.model;

import java.util.List;

public class MaxFlowResult {
    private final int maxVehiclesPerHour;
    private final List<String> bottleneckEdges;

    public MaxFlowResult(int maxVehiclesPerHour, List<String> bottleneckEdges) {
        this.maxVehiclesPerHour = maxVehiclesPerHour;
        this.bottleneckEdges = bottleneckEdges;
    }

    public int getMaxVehiclesPerHour() { return maxVehiclesPerHour; }
    public List<String> getBottleneckEdges() { return bottleneckEdges; }
}
