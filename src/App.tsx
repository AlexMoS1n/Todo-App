import React, { useState } from 'react';
import { useTodos } from './hooks/useTodos';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodoStats } from './components/TodoStats';
import { TodoFilter } from './components/TodoFilter';
import { FilterType } from './types/todo';
import './styles/App.css';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    getActiveTodos,
    getCompletedTodos
  } = useTodos();

  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');

  const getFilteredTodos = () => {
    switch (currentFilter) {
      case 'active':
        return getActiveTodos();
      case 'completed':
        return getCompletedTodos();
      default:
        return todos;
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>ToDo App</h1>
        
        <TodoForm onAdd={addTodo} />
        
        <TodoFilter
          currentFilter={currentFilter}
          onFilterChange={setCurrentFilter}
        />
        
        <div className="lists-container">
          <TodoList
            todos={getFilteredTodos()}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            title={
              currentFilter === 'all' ? 'Все задачи' :
              currentFilter === 'active' ? 'Активные задачи' :
              'Выполненные задачи'
            }
          />
        </div>
        
        <TodoStats
          total={todos.length}
          active={getActiveTodos().length}
          completed={getCompletedTodos().length}
          onClearCompleted={clearCompleted}
        />
      </div>
    </div>
  );
}

export default App;