# Emergency Road Planner — DSA Hackathon (Java Edition)

[![Java 17](https://img.shields.io/badge/Java-17%2B-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite 8](https://img.shields.io/badge/Vite-8.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

A mission-critical emergency road network routing, mass civilian evacuation, and post-disaster infrastructure recovery system built for Data Structures & Algorithms hackathons.

Features both an **interactive, fully functional web visualizer** and a **complete, standalone Java 17 Maven project** ready for hackathon evaluation and deployment.

---

## 📂 Repository Directory Structure

```
├── java/                                      # Standalone Java 17 Maven Project
│   ├── pom.xml                                # Maven build descriptor with JUnit 5 & Exec plugins
│   ├── README.md                              # Java-specific compilation guide
│   └── src/main/java/com/emergency/planner/
│       ├── Main.java                          # CLI driver with microsecond benchmarks
│       ├── algo/
│       │   ├── AStarRouter.java               # A* Search with Euclidean geometric heuristic
│       │   ├── DijkstraRouter.java            # Dynamic Dijkstra with PriorityQueue Min-Heap
│       │   ├── EmergencyTaskScheduler.java    # Kahn's Topological Sort with cycle detection
│       │   ├── KruskalMST.java                # Kruskal's Minimum Spanning Tree
│       │   └── MaxFlowEvacuation.java         # Edmonds-Karp / Ford-Fulkerson Max Flow
│       ├── ds/
│       │   ├── DisjointSetUnion.java          # DSU / Union-Find (Path Compression + Rank)
│       │   └── Graph.java                     # Dynamic Adjacency List Graph
│       └── model/
│           ├── EmergencyTask.java             # Incident response action item
│           ├── EmergencyVehicle.java          # Siren bonuses & flood clearance limits
│           ├── FloodRisk.java                 # Flood hazard severity levels
│           ├── MaxFlowResult.java             # Bottleneck cut edges & throughput
│           ├── MstResult.java                 # Clearance hours & spanning backbone
│           ├── Node.java                      # Hospitals, Fire Stations, Shelters, Incidents
│           ├── RoadEdge.java                  # Dynamic road attributes & capacities
│           ├── RouteResult.java               # Optimal path, distance & ETA
│           ├── TopoResult.java                # Phased crisis schedule & feasibility
│           └── TrafficLevel.java              # Congestion multipliers
├── src/                                       # Interactive React 19 Web Visualizer
│   ├── algorithms/                            # Client-side implementations with step traces
│   ├── components/                            # UI: Canvas map, step player, Java IDE, modal
│   ├── data/                                  # Default disaster scenario network & Java code
│   └── types/                                 # TypeScript data model interfaces
├── public/                                    # Static assets & icons
├── Dockerfile                                 # Multi-stage container build for Cloud Run / Docker
├── vercel.json                                # Zero-config Vercel deployment
├── netlify.toml                               # Zero-config Netlify deployment
├── package.json                               # npm scripts (dev, build, start, preview, lint)
└── vite.config.ts                             # Vite + Tailwind v4 configuration
```

---

## 🚀 How to Deploy the Web Application

### Option 1: Vercel (1-Click CLI)
```bash
# 1. Build the production assets
npm run build

# 2. Deploy to Vercel
npx vercel --prod
```
The included `vercel.json` automatically handles routing all SPA traffic to `dist/index.html`.

### Option 2: Netlify
```bash
npm run build
npx netlify-cli deploy --prod --dir=dist
```
The included `netlify.toml` automatically configures publishing `dist/` with SPA rewrite rules.

### Option 3: Docker & Cloud Run
```bash
# Build Docker image
docker build -t emergency-road-planner .

# Run container locally on port 3000
docker run -p 3000:3000 emergency-road-planner
```

---

## ☕ How to Run the Java Core Application

### Method A: Pure `javac` & `java` CLI (No build tools required)
```bash
cd java

# Compile all source files into bin directory
mkdir -p bin
javac -d bin src/main/java/com/emergency/planner/**/*.java src/main/java/com/emergency/planner/Main.java

# Run the benchmark driver
java -cp bin com.emergency.planner.Main
```

### Method B: Apache Maven
```bash
cd java

# Build and package executable JAR
mvn clean package

# Execute the application
mvn exec:java
```

---

## 🧠 Data Structures & Algorithms Breakdown

| Algorithm | Data Structure | Time Complexity | Space Complexity | Mission-Critical Disaster Use-Case |
| :--- | :--- | :--- | :--- | :--- |
| **Dynamic Dijkstra** | `PriorityQueue<QueueEntry>` (Min-Heap) | $O((V + E) \log V)$ | $O(V)$ | Dynamic shortest path routing factoring sirens, variable traffic delays, and flood limits. |
| **A\* Heuristic Search** | Min-Heap + Euclidean Lower Bound | $O(E)$ | $O(V)$ | Ultra-fast single-target routing during urgent trauma center deliveries. |
| **Kruskal's MST** | Disjoint Set Union (`DSU` with Path Compression & Rank) | $O(E \log E)$ | $O(V + E)$ | Post-disaster backbone infrastructure recovery (connecting all hospitals with minimum bulldozing hours). |
| **Edmonds-Karp Max Flow** | Residual Network + BFS | $O(V \cdot E^2)$ | $O(V^2)$ | Civilian evacuation throughput optimization and min-cut choke point identification. |
| **Kahn's Topological Sort** | In-Degree Array + FIFO Queue | $O(V + E)$ | $O(V + E)$ | Sequenced crisis protocol execution with circular dependency deadlock detection. |

---

## 💻 Web Visualizer Features

1. **Interactive Simulation Map**:
   - Visualizes disaster zones, river canal crossings, trauma hospitals, fire stations, and relief camps.
   - Interactive road controls: click any road to toggle **Blocked**, cycle **Traffic** (Clear $\to$ Gridlock), or cycle **Flood Inundation** (None $\to$ Severe).
   - Animated emergency vehicle dispatch with sirens and dynamic mid-route recalculation.
2. **Java Code Studio**:
   - Tabbed syntax-highlighted browser for all 11 Java classes and Maven `pom.xml`.
   - In-browser **Virtual JVM Terminal** executing real-time algorithm benchmarks.
   - One-click **"Download Project (.zip)"** button using JSZip to download the complete Maven project.
3. **Emergency Scenario Presets**:
   - *💥 Downtown Gas Rupture*
   - *🌊 Canal Flash Flood*
   - *🌉 River Bridge Collapse*
