import { renderHook, act } from '@testing-library/react';
import { useTodos } from '../hooks/useTodos'; // путь к вашему хуку
import { Todo } from '../types/todo';

describe('useTodos hook', () => {
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: jest.fn((key: string) => store[key] || null),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        store = {};
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
      }),
    };
  })();

  beforeAll(() => {
    // Заменяем глобальный localStorage мок-объектом
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });
  });

  beforeEach(() => {
    localStorageMock.clear();
    jest.clearAllMocks();
  });

  test('инициализируется с пустым списком, если в localStorage нет данных', () => {
    localStorageMock.getItem.mockReturnValueOnce(null);

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual([]);
    expect(localStorageMock.getItem).toHaveBeenCalledWith('todos');
  });

  test('инициализируется с данными из localStorage, если они есть', () => {
    const savedTodos: Todo[] = [
      {
        id: '1',
        text: 'Test todo',
        completed: false,
        createdAt: new Date('2023-01-01'),
      },
    ];
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(savedTodos));

    const { result } = renderHook(() => useTodos());

    expect(result.current.todos).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: '1',
          text: 'Test todo',
          completed: false,
        }),
      ])
    );
  });

  test('addTodo добавляет новый todo в начало списка', () => {
    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.addTodo('New task');
    });

    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].text).toBe('New task');
    expect(result.current.todos[0].completed).toBe(false);
    expect(typeof result.current.todos[0].id).toBe('string');
    expect(result.current.todos[0].createdAt).toBeInstanceOf(Date);
  });

  test('toggleTodo переключает completed у нужного todo', () => {
    const initialTodos: Todo[] = [
      { id: '1', text: 'Task 1', completed: false, createdAt: new Date() },
      { id: '2', text: 'Task 2', completed: true, createdAt: new Date() },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(initialTodos));

    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.toggleTodo('1');
    });

    expect(result.current.todos.find(t => t.id === '1')?.completed).toBe(true);

    act(() => {
      result.current.toggleTodo('2');
    });

    expect(result.current.todos.find(t => t.id === '2')?.completed).toBe(false);
  });

  test('deleteTodo удаляет todo по id', () => {
    const initialTodos: Todo[] = [
      { id: '1', text: 'Task 1', completed: false, createdAt: new Date() },
      { id: '2', text: 'Task 2', completed: true, createdAt: new Date() },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(initialTodos));

    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.deleteTodo('1');
    });

    expect(result.current.todos.find(t => t.id === '1')).toBeUndefined();
    expect(result.current.todos.length).toBe(1);
  });

  test('clearCompleted удаляет все выполненные задачи', () => {
    const initialTodos: Todo[] = [
      { id: '1', text: 'Task 1', completed: true, createdAt: new Date() },
      { id: '2', text: 'Task 2', completed: false, createdAt: new Date() },
      { id: '3', text: 'Task 3', completed: true, createdAt: new Date() },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(initialTodos));

    const { result } = renderHook(() => useTodos());

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.todos.every(todo => !todo.completed)).toBe(true);
    expect(result.current.todos.length).toBe(1);
    expect(result.current.todos[0].id).toBe('2');
  });

  test('getActiveTodos возвращает только активные задачи', () => {
    const initialTodos: Todo[] = [
      { id: '1', text: 'Task 1', completed: true, createdAt: new Date() },
      { id: '2', text: 'Task 2', completed: false, createdAt: new Date() },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(initialTodos));

    const { result } = renderHook(() => useTodos());

    expect(result.current.getActiveTodos()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '2' }),
      ])
    );
  });

  test('getCompletedTodos возвращает только выполненные задачи', () => {
    const initialTodos: Todo[] = [
      { id: '1', text: 'Task 1', completed: true, createdAt: new Date() },
      { id: '2', text: 'Task 2', completed: false, createdAt: new Date() },
    ];

    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(initialTodos));

    const { result } = renderHook(() => useTodos());

    expect(result.current.getCompletedTodos()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: '1' }),
      ])
    );
  });
});
