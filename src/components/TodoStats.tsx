import React from 'react';
import '../styles/TodoStats.css';

interface TodoStatsProps {
  total: number;
  active: number;
  completed: number;
  onClearCompleted: () => void;
}

export const TodoStats: React.FC<TodoStatsProps> = ({
  total,
  active,
  completed,
  onClearCompleted
}) => {
  return (
    <div className="todo-stats">
      <div className="stats-info">
        <span>Всего: {total}</span>
        <span>Активные: {active}</span>
        <span>Выполненные: {completed}</span>
      </div>
      {completed > 0 && (
        <button onClick={onClearCompleted} className="clear-button">
          Очистить выполненные
        </button>
      )}
    </div>
  );
};