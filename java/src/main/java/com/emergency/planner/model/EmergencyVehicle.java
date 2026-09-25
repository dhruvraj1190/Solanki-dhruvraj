package com.emergency.planner.model;

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
