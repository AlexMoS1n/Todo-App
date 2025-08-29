import React, { useState } from 'react';
import '../styles/TodoForm.css';

interface TodoFormProps {
  onAdd: (text: string) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
    }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Что нужно сделать?"
        className="todo-input"
      />
      <button type="submit" className="add-button">
        Добавить
      </button>
    </form>
  );
};