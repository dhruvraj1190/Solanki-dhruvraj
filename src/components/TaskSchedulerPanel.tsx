import React, { useState } from 'react';
import { EmergencyTask, TopoSortResult } from '../types';
import { runKahnTopologicalSort } from '../algorithms/toposort';
import {
  ListOrdered,
  AlertTriangle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface TaskSchedulerPanelProps {
  initialTasks: EmergencyTask[];
  theme?: 'dark' | 'light';
}

export const TaskSchedulerPanel: React.FC<TaskSchedulerPanelProps> = ({
  initialTasks,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [tasks, setTasks] = useState<EmergencyTask[]>(initialTasks);
  const [isDeadlocked, setIsDeadlocked] = useState<boolean>(false);

  const topoResult: TopoSortResult = runKahnTopologicalSort(tasks);

  const handleToggleDeadlock = () => {
    if (isDeadlocked) {
      setTasks(initialTasks);
      setIsDeadlocked(false);
    } else {
      const modified = tasks.map(t => {
        if (t.id === 'T1') {
          return { ...t, dependencies: ['T7'] };
        }
        return t;
      });
      setTasks(modified);
      setIsDeadlocked(true);
    }
  };

  const taskMap = new Map(tasks.map(t => [t.id, t]));

  return (
    <div
      className={`rounded-2xl border p-5 space-y-5 shadow-sm transition-colors duration-200 ${
        isDark
          ? 'bg-[#0f172a]/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ListOrdered className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold">
              Crisis Action Plan: Topological Task Scheduler
            </h2>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                isDark
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-800'
              }`}
            >
              Kahn’s Algorithm · O(V + E)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sequences multi-agency emergency operations (gas cutoff, fire containment, rubble removal, green ambulance corridor) ensuring strict prerequisite compliance.
          </p>
        </div>

        {/* Deadlock Injection Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleDeadlock}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isDeadlocked
                ? 'bg-rose-600 text-white shadow-xs'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{isDeadlocked ? 'Remove Deadlock' : 'Simulate Circular Deadlock'}</span>
          </button>
        </div>
      </div>

      {/* Deadlock Warning Banner */}
      {topoResult.hasCycle ? (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-xl text-xs text-rose-200 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">
              CRITICAL DEADLOCK DETECTED (Cycle in Directed Graph)
            </span>
            Kahn's in-degree queue terminated prematurely. Circular dependency exists between tasks:
            <code className="mx-1 px-1.5 py-0.5 rounded bg-black/40 text-rose-300 font-mono">
              {topoResult.cycleNodes?.join(' ↔ ')}
            </code>
            Rescue operations are stalled because prerequisite conditions can never be resolved!
          </div>
        </div>
      ) : (
        <div
          className={`p-3.5 rounded-xl border text-xs flex items-center gap-2.5 ${
            isDark
              ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Directed Acyclic Graph (DAG) verified. All {tasks.length} emergency operations are scheduled in optimal chronological order across {topoResult.levels.length} execution tiers.
          </span>
        </div>
      )}

      {/* Phased Execution Plan (DAG Levels) */}
      {!topoResult.hasCycle && (
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
            Phased Incident Response Sequence
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {topoResult.levels.map(tier => (
              <div
                key={tier.level}
                className={`p-3.5 rounded-xl border space-y-2 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">Stage 0{tier.level}</span>
                  <span className="text-slate-400 text-[10px]">{tier.taskIds.length} parallel action{tier.taskIds.length > 1 ? 's' : ''}</span>
                </div>

                <div className="space-y-2">
                  {tier.taskIds.map(tId => {
                    const task = taskMap.get(tId);
                    if (!task) return null;
                    return (
                      <div
                        key={tId}
                        className={`p-2.5 rounded-lg border text-xs ${
                          isDark
                            ? 'bg-slate-900 border-slate-800'
                            : 'bg-white border-slate-200 shadow-xs'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-mono text-[11px] font-bold text-slate-900 dark:text-white">
                            [{task.id}]
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {task.durationMinutes}m
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-[11px] leading-snug">{task.title}</p>
                        {task.dependencies.length > 0 && (
                          <div className="mt-1.5 text-[10px] font-mono text-slate-400">
                            Prereq: {task.dependencies.join(', ')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Task Dependency Table */}
      <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
        <h3 className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold">
          Task Master Directory & In-Degree Status
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2.5 px-3">Task ID</th>
                <th className="py-2.5 px-3">Operation Title</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Prerequisites</th>
                <th className="py-2.5 px-3">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {tasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/60">
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white">{task.id}</td>
                  <td className="py-2.5 px-3">{task.title}</td>
                  <td className="py-2.5 px-3">{task.durationMinutes} mins</td>
                  <td className="py-2.5 px-3 text-amber-600 dark:text-amber-300 font-semibold">
                    {task.dependencies.length > 0 ? task.dependencies.join(', ') : 'None (Root)'}
                  </td>
                  <td className="py-2.5 px-3 capitalize text-slate-500">
                    {task.category.replace('_', ' ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
