package com.emergency.planner.model;

import java.util.List;

public class TopoResult {
    private final boolean feasible;
    private final List<EmergencyTask> order;

    public TopoResult(boolean feasible, List<EmergencyTask> order) {
        this.feasible = feasible;
        this.order = order;
    }

    public boolean isFeasible() { return feasible; }
    public List<EmergencyTask> getOrder() { return order; }
}
