package com.emergency.planner.model;

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
