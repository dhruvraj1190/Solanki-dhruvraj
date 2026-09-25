import { EmergencyTask, TopoSortResult, AlgorithmStep } from '../types';

export function runKahnTopologicalSort(tasks: EmergencyTask[]): TopoSortResult {
  const steps: AlgorithmStep[] = [];
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>(); // prerequisite -> dependent tasks
  const taskMap = new Map(tasks.map(t => [t.id, t]));

  tasks.forEach(t => {
    inDegree.set(t.id, 0);
    adj.set(t.id, []);
  });

  // Build graph: if task B depends on task A, edge A -> B
  tasks.forEach(t => {
    t.dependencies.forEach(prereqId => {
      if (adj.has(prereqId)) {
        adj.get(prereqId)!.push(t.id);
        inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
      }
    });
  });

  // Queue of tasks with 0 dependencies
  const queue: string[] = [];
  tasks.forEach(t => {
    if (inDegree.get(t.id) === 0) {
      queue.push(t.id);
    }
  });

  let stepCount = 0;
  const orderedTaskIds: string[] = [];
  const levels: { level: number; taskIds: string[] }[] = [];

  steps.push({
    stepNumber: ++stepCount,
    description: `Kahn's Topological Sort Initialized. Computed in-degrees for ${tasks.length} emergency response protocols. Initial zero in-degree queue: [${queue.map(id => taskMap.get(id)?.title.split(' ')[0]).join(', ')}].`,
    visitedNodeIds: [],
    frontierNodeIds: [...queue],
    pathSoFarNodeIds: [],
    heapState: queue.map(id => ({ node: id, priority: 0, label: 'In-Degree: 0' })),
    metricNotes: `Total Tasks: ${tasks.length} | Ready to execute immediately: ${queue.length}`,
  });

  let currentLevel = 1;

  while (queue.length > 0) {
    const levelSize = queue.length;
    const currentLevelTasks: string[] = [];

    for (let i = 0; i < levelSize; i++) {
      const u = queue.shift()!;
      orderedTaskIds.push(u);
      currentLevelTasks.push(u);

      const task = taskMap.get(u);
      steps.push({
        stepNumber: ++stepCount,
        description: `Scheduled [Phase ${currentLevel}]: "${task?.title}" (${task?.durationMinutes} mins). Decrementing dependency counts of subsequent recovery actions.`,
        currentNodeId: u,
        visitedNodeIds: [...orderedTaskIds],
        frontierNodeIds: [...queue],
        pathSoFarNodeIds: [...orderedTaskIds],
        metricNotes: `Category: ${task?.category} | Prereqs satisfied`,
      });

      const dependents = adj.get(u) || [];
      for (const v of dependents) {
        const currentDeg = (inDegree.get(v) || 1) - 1;
        inDegree.set(v, currentDeg);

        if (currentDeg === 0) {
          queue.push(v);
          const depTask = taskMap.get(v);
          steps.push({
            stepNumber: ++stepCount,
            description: `Dependency satisfied for "${depTask?.title}". In-degree reached 0; added to dispatch queue.`,
            currentNodeId: v,
            visitedNodeIds: [...orderedTaskIds],
            frontierNodeIds: [...queue],
            pathSoFarNodeIds: [...orderedTaskIds],
            heapState: queue.map(id => ({ node: id, priority: 0, label: 'In-Degree: 0' })),
          });
        }
      }
    }

    levels.push({ level: currentLevel, taskIds: currentLevelTasks });
    currentLevel++;
  }

  const hasCycle = orderedTaskIds.length !== tasks.length;
  const cycleNodes = hasCycle ? tasks.filter(t => !orderedTaskIds.includes(t.id)).map(t => t.id) : undefined;

  if (hasCycle) {
    steps.push({
      stepNumber: ++stepCount,
      description: `CIRCULAR DEPENDENCY DETECTED! Deadlock in emergency protocol chain involving tasks: ${cycleNodes?.join(', ')}.`,
      visitedNodeIds: orderedTaskIds,
      frontierNodeIds: cycleNodes || [],
      pathSoFarNodeIds: orderedTaskIds,
      metricNotes: `Deadlock: Kahn's algorithm finished before scheduling all tasks.`,
    });
  } else {
    steps.push({
      stepNumber: ++stepCount,
      description: `Optimal Incident Recovery Execution Schedule successfully generated! All ${tasks.length} critical operations sequenced safely across ${levels.length} phases.`,
      visitedNodeIds: orderedTaskIds,
      frontierNodeIds: [],
      pathSoFarNodeIds: orderedTaskIds,
      metricNotes: `No cyclic dependencies found. Execution is topologically valid.`,
    });
  }

  return {
    orderedTaskIds,
    hasCycle,
    cycleNodes,
    levels,
    steps,
  };
}
