import React from 'react';
import { Todo } from '../types/todo';
import '../styles/TodoList.css';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  title: string;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  title
}) => {
  if (todos.length === 0) {
    return null;
  }

  return (
    <div className="todo-list-container">
      <h3>{title} ({todos.length})</h3>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => onToggle(todo.id)}
              className="todo-checkbox"
            />
            <span
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => onDelete(todo.id)}
              className="delete-button"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};