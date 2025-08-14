import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Todo, TodoInput, TodoFilters, TodoStats, Priority } from '../models/todo.model';

// GraphQL Queries
const GET_TODOS = gql`
  query GetTodos($completed: Boolean, $category: String, $priority: Priority, $limit: Int, $offset: Int) {
    todos(completed: $completed, category: $category, priority: $priority, limit: $limit, offset: $offset) {
      id
      title
      description
      completed
      priority
      category
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const GET_TODO = gql`
  query GetTodo($id: ID!) {
    todo(id: $id) {
      id
      title
      description
      completed
      priority
      category
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const GET_TODOS_COUNT = gql`
  query GetTodosCount($completed: Boolean) {
    todosCount(completed: $completed)
  }
`;

const GET_COMPLETED_COUNT = gql`
  query GetCompletedCount {
    completedTodosCount
  }
`;

const GET_PENDING_COUNT = gql`
  query GetPendingCount {
    pendingTodosCount
  }
`;

// GraphQL Mutations
const CREATE_TODO = gql`
  mutation CreateTodo($input: TodoInput!) {
    createTodo(input: $input) {
      id
      title
      description
      completed
      priority
      category
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $input: TodoInput!) {
    updateTodo(id: $id, input: $input) {
      id
      title
      description
      completed
      priority
      category
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!) {
    toggleTodo(id: $id) {
      id
      title
      description
      completed
      priority
      category
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const MARK_TODOS_COMPLETED = gql`
  mutation MarkTodosCompleted($ids: [ID!]!) {
    markTodosCompleted(ids: $ids) {
      id
      title
      description
      completed
      priority
      category
      dueDate
      createdAt
      updatedAt
    }
  }
`;

const DELETE_TODOS = gql`
  mutation DeleteTodos($ids: [ID!]!) {
    deleteTodos(ids: $ids)
  }
`;

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public todos$ = this.todosSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor(private apollo: Apollo) {
    console.log('TodoService initialized');
  }

  // Load all todos with optional filters
  loadTodos(filters: TodoFilters = {}): Observable<Todo[]> {
    console.log('loadTodos called with filters:', filters);
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    return this.apollo.watchQuery<{ todos: Todo[] }>({
      query: GET_TODOS,
      variables: filters,
      fetchPolicy: 'network-only',
      errorPolicy: 'all'
    }).valueChanges.pipe(
      tap(result => {
        console.log('Apollo query result:', result);
      }),
      map(result => {
        console.log('GraphQL result:', result);
        if (result.data && result.data.todos) {
          const todos = result.data.todos;
          console.log('Todos received:', todos);
          this.todosSubject.next(todos);
          this.loadingSubject.next(false);
          return todos;
        } else {
          console.error('No data in GraphQL response:', result);
          this.loadingSubject.next(false);
          this.errorSubject.next('No data received from server');
          return [];
        }
      }),
      catchError(error => {
        console.error('GraphQL error:', error);
        this.errorSubject.next(error.message || 'Failed to fetch todos');
        this.loadingSubject.next(false);
        return [];
      })
    );
  }

  // Get a single todo by ID
  getTodo(id: string): Observable<Todo> {
    return this.apollo.watchQuery<{ todo: Todo }>({
      query: GET_TODO,
      variables: { id }
    }).valueChanges.pipe(
      map(result => result.data.todo)
    );
  }

  // Create a new todo
  createTodo(todoInput: TodoInput): Observable<Todo> {
    return this.apollo.mutate<{ createTodo: Todo }>({
      mutation: CREATE_TODO,
      variables: { input: todoInput },
      refetchQueries: [{ query: GET_TODOS }]
    }).pipe(
      map(result => {
        if (result.data) {
          const newTodo = result.data.createTodo;
          const currentTodos = this.todosSubject.value;
          this.todosSubject.next([newTodo, ...currentTodos]);
          return newTodo;
        }
        throw new Error('Failed to create todo');
      })
    );
  }

  // Update an existing todo
  updateTodo(id: string, todoInput: TodoInput): Observable<Todo> {
    return this.apollo.mutate<{ updateTodo: Todo }>({
      mutation: UPDATE_TODO,
      variables: { id, input: todoInput },
      refetchQueries: [{ query: GET_TODOS }]
    }).pipe(
      map(result => {
        if (result.data) {
          const updatedTodo = result.data.updateTodo;
          const currentTodos = this.todosSubject.value;
          const updatedTodos = currentTodos.map(todo => 
            todo.id === id ? updatedTodo : todo
          );
          this.todosSubject.next(updatedTodos);
          return updatedTodo;
        }
        throw new Error('Failed to update todo');
      })
    );
  }

  // Delete a todo
  deleteTodo(id: string): Observable<boolean> {
    return this.apollo.mutate<{ deleteTodo: boolean }>({
      mutation: DELETE_TODO,
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }]
    }).pipe(
      map(result => {
        if (result.data?.deleteTodo) {
          const currentTodos = this.todosSubject.value;
          const updatedTodos = currentTodos.filter(todo => todo.id !== id);
          this.todosSubject.next(updatedTodos);
          return true;
        }
        return false;
      })
    );
  }

  // Toggle todo completion status
  toggleTodo(id: string): Observable<Todo> {
    return this.apollo.mutate<{ toggleTodo: Todo }>({
      mutation: TOGGLE_TODO,
      variables: { id },
      refetchQueries: [{ query: GET_TODOS }]
    }).pipe(
      map(result => {
        if (result.data) {
          const toggledTodo = result.data.toggleTodo;
          const currentTodos = this.todosSubject.value;
          const updatedTodos = currentTodos.map(todo => 
            todo.id === id ? toggledTodo : todo
          );
          this.todosSubject.next(updatedTodos);
          return toggledTodo;
        }
        throw new Error('Failed to toggle todo');
      })
    );
  }

  // Mark multiple todos as completed
  markTodosCompleted(ids: string[]): Observable<Todo[]> {
    return this.apollo.mutate<{ markTodosCompleted: Todo[] }>({
      mutation: MARK_TODOS_COMPLETED,
      variables: { ids },
      refetchQueries: [{ query: GET_TODOS }]
    }).pipe(
      map(result => {
        if (result.data) {
          const updatedTodos = result.data.markTodosCompleted;
          const currentTodos = this.todosSubject.value;
          const newTodos = currentTodos.map(todo => {
            const updated = updatedTodos.find(t => t.id === todo.id);
            return updated || todo;
          });
          this.todosSubject.next(newTodos);
          return updatedTodos;
        }
        throw new Error('Failed to mark todos as completed');
      })
    );
  }

  // Delete multiple todos
  deleteTodos(ids: string[]): Observable<boolean> {
    return this.apollo.mutate<{ deleteTodos: boolean }>({
      mutation: DELETE_TODOS,
      variables: { ids },
      refetchQueries: [{ query: GET_TODOS }]
    }).pipe(
      map(result => {
        if (result.data?.deleteTodos) {
          const currentTodos = this.todosSubject.value;
          const updatedTodos = currentTodos.filter(todo => !ids.includes(todo.id));
          this.todosSubject.next(updatedTodos);
          return true;
        }
        return false;
      })
    );
  }

  // Get todos count
  getTodosCount(completed?: boolean): Observable<number> {
    return this.apollo.watchQuery<{ todosCount: number }>({
      query: GET_TODOS_COUNT,
      variables: { completed }
    }).valueChanges.pipe(
      map(result => result.data.todosCount)
    );
  }

  // Get completed todos count
  getCompletedCount(): Observable<number> {
    return this.apollo.watchQuery<{ completedTodosCount: number }>({
      query: GET_COMPLETED_COUNT
    }).valueChanges.pipe(
      map(result => result.data.completedTodosCount)
    );
  }

  // Get pending todos count
  getPendingCount(): Observable<number> {
    return this.apollo.watchQuery<{ pendingTodosCount: number }>({
      query: GET_PENDING_COUNT
    }).valueChanges.pipe(
      map(result => result.data.pendingTodosCount)
    );
  }

  // Get current todos from cache
  getCurrentTodos(): Todo[] {
    return this.todosSubject.value;
  }

  // Clear error
  clearError(): void {
    this.errorSubject.next(null);
  }

  // Get priority options
  getPriorityOptions(): { value: Priority; label: string; color: string }[] {
    return [
      { value: Priority.LOW, label: 'Low', color: 'low' },
      { value: Priority.MEDIUM, label: 'Medium', color: 'medium' },
      { value: Priority.HIGH, label: 'High', color: 'high' },
      { value: Priority.URGENT, label: 'Urgent', color: 'urgent' }
    ];
  }

  // Get category suggestions based on existing todos
  getCategorySuggestions(): string[] {
    const todos = this.todosSubject.value;
    const categories = [...new Set(todos.map(todo => todo.category))];
    return categories.filter(category => category && category !== 'General');
  }
} 