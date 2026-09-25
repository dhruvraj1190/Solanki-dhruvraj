package com.emergency.planner.model;

import java.util.List;

public class EmergencyTask {
    private final String id;
    private final String title;
    private final int durationMinutes;
    private final List<String> dependencies;

    public EmergencyTask(String id, String title, int durationMinutes, List<String> dependencies) {
        this.id = id;
        this.title = title;
        this.durationMinutes = durationMinutes;
        this.dependencies = dependencies;
    }

    public String getId() { return id; }
    public String getTitle() { return title; }
    public int getDurationMinutes() { return durationMinutes; }
    public List<String> getDependencies() { return dependencies; }
}
