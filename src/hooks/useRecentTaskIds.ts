import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mars.recentTasks';

export function useRecentTaskIds() {
  const [taskIds, setTaskIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as string[];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(taskIds.slice(0, 20)));
  }, [taskIds]);

  function addTaskId(taskId: string) {
    setTaskIds((current) => [taskId, ...current.filter((item) => item !== taskId)].slice(0, 20));
  }

  return { taskIds, addTaskId, setTaskIds };
}
