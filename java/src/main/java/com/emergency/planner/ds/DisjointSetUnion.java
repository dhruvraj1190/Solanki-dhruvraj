package com.emergency.planner.ds;

import java.util.HashMap;
import java.util.Map;

/**
 * Disjoint Set Union (DSU / Union-Find)
 * Optimizations:
 * 1. Path Compression: Flattens the tree during find()
 * 2. Union by Rank: Attaches smaller tree under root of larger tree
 *
 * Amortized Time Complexity: O(α(N)) ≈ O(1) per operation (Inverse Ackermann function)
 */
public class DisjointSetUnion {
    private final Map<String, String> parent = new HashMap<>();
    private final Map<String, Integer> rank = new HashMap<>();

    public void makeSet(String element) {
        parent.put(element, element);
        rank.put(element, 0);
    }

    public String find(String element) {
        String p = parent.get(element);
        if (p == null) return element;
        if (p.equals(element)) return element;

        // Path Compression
        String root = find(p);
        parent.put(element, root);
        return root;
    }

    public boolean union(String x, String y) {
        String rootX = find(x);
        String rootY = find(y);

        if (rootX.equals(rootY)) {
            return false; // Already in the same disjoint set; adding this edge creates a cycle!
        }

        // Union by Rank
        int rankX = rank.getOrDefault(rootX, 0);
        int rankY = rank.getOrDefault(rootY, 0);

        if (rankX < rankY) {
            parent.put(rootX, rootY);
        } else if (rankX > rankY) {
            parent.put(rootY, rootX);
        } else {
            parent.put(rootY, rootX);
            rank.put(rootX, rankX + 1);
        }

        return true;
    }

    public boolean isConnected(String x, String y) {
        return find(x).equals(find(y));
    }
}
