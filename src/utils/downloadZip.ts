import JSZip from 'jszip';
import { JAVA_SOURCE_FILES } from '../data/javaSourceFiles';

export interface DownloadResult {
  success: boolean;
  message: string;
}

export async function generateAndDownloadZip(
  onProgress?: (status: string) => void
): Promise<DownloadResult> {
  try {
    if (onProgress) onProgress('Preparing Java project files...');

    const zip = new JSZip();
    const rootFolder = zip.folder('emergency-road-planner');

    if (!rootFolder) {
      throw new Error('Failed to create root folder in ZIP archive.');
    }

    // 1. Add README.md
    rootFolder.file(
      'README.md',
      `# Emergency Road Planner — Java Data Structures & Algorithms

Mission-critical dynamic road routing, evacuation throughput, and disaster recovery graph engine.

## 🚀 Quick Run (Java 17+)
\`\`\`bash
# 1. Compile all Java sources
mkdir -p bin
javac -d bin src/main/java/com/emergency/planner/**/*.java src/main/java/com/emergency/planner/Main.java

# 2. Run the driver benchmark
java -cp bin com.emergency.planner.Main
\`\`\`

## 📦 Run with Maven
\`\`\`bash
mvn clean package
mvn exec:java
\`\`\`
`
    );

    // 2. Add pom.xml
    const pomFile = JAVA_SOURCE_FILES.find(f => f.filename === 'pom.xml');
    if (pomFile) {
      rootFolder.file('pom.xml', pomFile.code);
    }

    if (onProgress) onProgress('Adding algorithms and data structures...');

    // 3. Add Java Source Files to correct directories
    const srcFolder = rootFolder.folder('src/main/java/com/emergency/planner');
    if (!srcFolder) throw new Error('Failed to create src directory.');

    const algoFolder = srcFolder.folder('algo');
    const dsFolder = srcFolder.folder('ds');
    const modelFolder = srcFolder.folder('model');

    JAVA_SOURCE_FILES.forEach(file => {
      if (file.filename === 'pom.xml') return;

      if (file.category === 'algo' && algoFolder) {
        algoFolder.file(file.filename, file.code);
      } else if (file.category === 'ds' && dsFolder) {
        dsFolder.file(file.filename, file.code);
      } else if (file.category === 'model' && modelFolder) {
        modelFolder.file(file.filename, file.code);
      } else {
        srcFolder.file(file.filename, file.code);
      }
    });

    // 4. Ensure auxiliary model classes are present
    if (modelFolder) {
      modelFolder.file(
        'TrafficLevel.java',
        `package com.emergency.planner.model;\n\npublic enum TrafficLevel {\n    CLEAR,\n    MODERATE,\n    HEAVY,\n    GRIDLOCK\n}\n`
      );
      modelFolder.file(
        'FloodRisk.java',
        `package com.emergency.planner.model;\n\npublic enum FloodRisk {\n    NONE,\n    MODERATE,\n    SEVERE\n}\n`
      );
      modelFolder.file(
        'RouteResult.java',
        `package com.emergency.planner.model;\n\nimport java.util.List;\n\npublic class RouteResult {\n    private final boolean pathFound;\n    private final List<String> path;\n    private final double totalDistanceKm;\n    private final double estimatedTimeMinutes;\n    private final int nodesExpanded;\n    private final int edgesRelaxed;\n\n    public RouteResult(boolean pathFound, List<String> path, double totalDistanceKm, double estimatedTimeMinutes, int nodesExpanded, int edgesRelaxed) {\n        this.pathFound = pathFound;\n        this.path = path;\n        this.totalDistanceKm = totalDistanceKm;\n        this.estimatedTimeMinutes = estimatedTimeMinutes;\n        this.nodesExpanded = nodesExpanded;\n        this.edgesRelaxed = edgesRelaxed;\n    }\n\n    public boolean isPathFound() { return pathFound; }\n    public List<String> getPath() { return path; }\n    public double getTotalDistanceKm() { return totalDistanceKm; }\n    public double getEstimatedTimeMinutes() { return estimatedTimeMinutes; }\n    public int getNodesExpanded() { return nodesExpanded; }\n    public int getEdgesRelaxed() { return edgesRelaxed; }\n}\n`
      );
      modelFolder.file(
        'MstResult.java',
        `package com.emergency.planner.model;\n\nimport java.util.List;\n\npublic class MstResult {\n    private final List<RoadEdge> mstEdges;\n    private final double totalClearanceHours;\n    private final int connectedComponents;\n\n    public MstResult(List<RoadEdge> mstEdges, double totalClearanceHours, int connectedComponents) {\n        this.mstEdges = mstEdges;\n        this.totalClearanceHours = totalClearanceHours;\n        this.connectedComponents = connectedComponents;\n    }\n\n    public List<RoadEdge> getMstEdges() { return mstEdges; }\n    public double getTotalClearanceHours() { return totalClearanceHours; }\n    public int getConnectedComponents() { return connectedComponents; }\n}\n`
      );
      modelFolder.file(
        'MaxFlowResult.java',
        `package com.emergency.planner.model;\n\nimport java.util.List;\n\npublic class MaxFlowResult {\n    private final int maxVehiclesPerHour;\n    private final List<String> bottleneckEdges;\n\n    public MaxFlowResult(int maxVehiclesPerHour, List<String> bottleneckEdges) {\n        this.maxVehiclesPerHour = maxVehiclesPerHour;\n        this.bottleneckEdges = bottleneckEdges;\n    }\n\n    public int getMaxVehiclesPerHour() { return maxVehiclesPerHour; }\n    public List<String> getBottleneckEdges() { return bottleneckEdges; }\n}\n`
      );
      modelFolder.file(
        'EmergencyTask.java',
        `package com.emergency.planner.model;\n\nimport java.util.List;\n\npublic class EmergencyTask {\n    private final String id;\n    private final String title;\n    private final int durationMinutes;\n    private final List<String> dependencies;\n\n    public EmergencyTask(String id, String title, int durationMinutes, List<String> dependencies) {\n        this.id = id;\n        this.title = title;\n        this.durationMinutes = durationMinutes;\n        this.dependencies = dependencies;\n    }\n\n    public String getId() { return id; }\n    public String getTitle() { return title; }\n    public int getDurationMinutes() { return durationMinutes; }\n    public List<String> getDependencies() { return dependencies; }\n}\n`
      );
      modelFolder.file(
        'TopoResult.java',
        `package com.emergency.planner.model;\n\nimport java.util.List;\n\npublic class TopoResult {\n    private final boolean feasible;\n    private final List<EmergencyTask> order;\n\n    public TopoResult(boolean feasible, List<EmergencyTask> order) {\n        this.feasible = feasible;\n        this.order = order;\n    }\n\n    public boolean isFeasible() { return feasible; }\n    public List<EmergencyTask> getOrder() { return order; }\n}\n`
      );
    }

    if (onProgress) onProgress('Compressing archive...');

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      mimeType: 'application/zip',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    if (onProgress) onProgress('Triggering browser download...');

    // Method 1: Blob URL download
    const filename = 'emergency-road-planner-java.zip';
    let triggered = false;

    try {
      const blobUrl = URL.createObjectURL(zipBlob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.setAttribute('download', filename);
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      triggered = true;

      setTimeout(() => {
        if (tempLink.parentNode) {
          document.body.removeChild(tempLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 3000);
    } catch {
      triggered = false;
    }

    // Method 2: Fallback to base64 Data URL if Blob URL blocked by iframe
    if (!triggered) {
      const base64Data = await zip.generateAsync({ type: 'base64' });
      const dataUri = 'data:application/zip;base64,' + base64Data;
      const dataLink = document.createElement('a');
      dataLink.href = dataUri;
      dataLink.setAttribute('download', filename);
      dataLink.style.display = 'none';
      document.body.appendChild(dataLink);
      dataLink.click();
      setTimeout(() => {
        if (dataLink.parentNode) {
          document.body.removeChild(dataLink);
        }
      }, 3000);
    }

    return {
      success: true,
      message: 'emergency-road-planner-java.zip generated and downloaded successfully!',
    };
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'Unknown ZIP error';
    return {
      success: false,
      message: `Failed to create ZIP: ${errMsg}`,
    };
  }
}
