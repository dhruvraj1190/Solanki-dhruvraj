package com.emergency.planner.algo;

import com.emergency.planner.model.EmergencyTask;
import com.emergency.planner.model.TopoResult;

import java.util.*;

/**
 * Kahn's Algorithm for Topological Sorting.
 * Time Complexity: O(V + E)
 * Space Complexity: O(V + E)
 *
 * Guarantees safe scheduling of dependent disaster actions
 * (e.g., Gas Isolation -> Fire Suppression -> Rubble Clearing -> Green Route).
 * Detects dangerous circular dependency deadlocks.
 */
public class EmergencyTaskScheduler {

    public static TopoResult scheduleTasks(List<EmergencyTask> tasks) {
        Map<String, Integer> inDegree = new HashMap<>();
        Map<String, List<String>> adj = new HashMap<>();
        Map<String, EmergencyTask> taskMap = new HashMap<>();

        for (EmergencyTask t : tasks) {
            inDegree.put(t.getId(), 0);
            adj.put(t.getId(), new ArrayList<>());
            taskMap.put(t.getId(), t);
        }

        // Build directed edges: prereq -> dependent
        for (EmergencyTask t : tasks) {
            for (String prereqId : t.getDependencies()) {
                if (adj.containsKey(prereqId)) {
                    adj.get(prereqId).add(t.getId());
                    inDegree.put(t.getId(), inDegree.get(t.getId()) + 1);
                }
            }
        }

        // Queue of ready tasks (0 unsatisfied prerequisites)
        Queue<String> queue = new LinkedList<>();
        for (EmergencyTask t : tasks) {
            if (inDegree.get(t.getId()) == 0) {
                queue.add(t.getId());
            }
        }

        List<EmergencyTask> ordered = new ArrayList<>();

        while (!queue.isEmpty()) {
            String u = queue.poll();
            ordered.add(taskMap.get(u));

            for (String v : adj.get(u)) {
                int deg = inDegree.get(v) - 1;
                inDegree.put(v, deg);
                if (deg == 0) {
                    queue.add(v);
                }
            }
        }

        boolean isFeasible = ordered.size() == tasks.size();
        return new TopoResult(isFeasible, ordered);
    }
}
