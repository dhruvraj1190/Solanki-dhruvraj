package com.emergency.planner.model;

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
