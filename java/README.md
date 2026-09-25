# Emergency Road Planner — Java DSA Core Engine

A production-grade Java 17+ reference implementation of dynamic emergency road network algorithms for hackathon submission and mission-critical deployment.

## Project Structure
```
java/
├── pom.xml
├── README.md
└── src/
    └── main/
        └── java/
            └── com/
                └── emergency/
                    └── planner/
                        ├── Main.java
                        ├── algo/
                        │   ├── AStarRouter.java
                        │   ├── DijkstraRouter.java
                        │   ├── EmergencyTaskScheduler.java
                        │   ├── KruskalMST.java
                        │   └── MaxFlowEvacuation.java
                        ├── ds/
                        │   ├── DisjointSetUnion.java
                        │   └── Graph.java
                        └── model/
                            ├── EmergencyTask.java
                            ├── EmergencyVehicle.java
                            ├── FloodRisk.java
                            ├── MaxFlowResult.java
                            ├── MstResult.java
                            ├── Node.java
                            ├── RoadEdge.java
                            ├── RouteResult.java
                            ├── TopoResult.java
                            └── TrafficLevel.java
```

## How to Run

### Method 1: Standard `javac` & `java` CLI
```bash
# Navigate to the java folder
cd java

# Compile all classes to bin directory
mkdir -p bin
javac -d bin src/main/java/com/emergency/planner/**/*.java src/main/java/com/emergency/planner/Main.java

# Run the benchmark driver
java -cp bin com.emergency.planner.Main
```

### Method 2: Maven
```bash
cd java
mvn clean package
mvn exec:java
```

## Core Algorithmic Time & Space Complexities

| Module | Algorithm | Time Complexity | Space Complexity |
| :--- | :--- | :--- | :--- |
| Dynamic Routing | Dijkstra (Min-Heap PriorityQueue) | $O((V + E) \log V)$ | $O(V)$ |
| Point-to-Point Routing | A* (Euclidean Admissible Heuristic) | $O(E)$ | $O(V)$ |
| Infrastructure Recovery | Kruskal's MST (Disjoint Set Union) | $O(E \log E)$ | $O(V + E)$ |
| Civilian Evacuation | Edmonds-Karp Max Flow (BFS Ford-Fulkerson) | $O(V \cdot E^2)$ | $O(V^2)$ |
| Action Protocol Order | Kahn's Topological Sort (In-Degree Queue) | $O(V + E)$ | $O(V + E)$ |
