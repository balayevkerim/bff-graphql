import { Component, OnInit } from '@angular/core';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-fragment-demo',
  template: `
    <div class="fragment-demo">
      <h2>GraphQL Fragments Demo</h2>
      
      <div class="demo-section">
        <h3>1. Full Todo Details (using TodoDetailedFields fragment)</h3>
        <button (click)="loadFullTodo()" [disabled]="loading">Load Full Todo Details</button>
        <div *ngIf="fullTodo" class="todo-detail">
          <h4>{{ fullTodo.title }}</h4>
          <p><strong>Description:</strong> {{ fullTodo.description }}</p>
          <p><strong>Priority:</strong> {{ fullTodo.priority }}</p>
          <p><strong>Category:</strong> {{ fullTodo.category }}</p>
          <p><strong>Due Date:</strong> {{ fullTodo.dueDate | date }}</p>
          <p><strong>Created:</strong> {{ fullTodo.createdAt | date }}</p>
          <p><strong>Updated:</strong> {{ fullTodo.updatedAt | date }}</p>
        </div>
      </div>

      <div class="demo-section">
        <h3>2. Basic Todo List (using TodoBasicFields fragment)</h3>
        <button (click)="loadBasicTodos()" [disabled]="loading">Load Basic Todos</button>
        <div *ngIf="basicTodos.length > 0" class="todo-list">
          <div *ngFor="let todo of basicTodos" class="todo-item">
            <span class="title">{{ todo.title }}</span>
            <span class="priority">{{ todo.priority }}</span>
            <span class="category">{{ todo.category }}</span>
            <span class="due-date">{{ todo.dueDate | date }}</span>
            <!-- Note: description and timestamps are not available in basic fragment -->
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>3. Todo List Items (using TodoListItem fragment)</h3>
        <button (click)="loadTodoList()" [disabled]="loading">Load Todo List</button>
        <div *ngIf="todoList.length > 0" class="todo-list">
          <div *ngFor="let todo of todoList" class="todo-item">
            <span class="title">{{ todo.title }}</span>
            <span class="description">{{ todo.description }}</span>
            <span class="priority">{{ todo.priority }}</span>
            <span class="category">{{ todo.category }}</span>
            <span class="due-date">{{ todo.dueDate | date }}</span>
            <span class="created">{{ todo.createdAt | date }}</span>
          </div>
        </div>
      </div>

      <div class="demo-section">
        <h3>4. Todo Statistics</h3>
        <button (click)="loadStats()" [disabled]="loading">Load Statistics</button>
        <div *ngIf="stats" class="stats">
          <p><strong>Total Todos:</strong> {{ stats.todosCount }}</p>
          <p><strong>Completed:</strong> {{ stats.completedCount }}</p>
          <p><strong>Pending:</strong> {{ stats.pendingCount }}</p>
        </div>
      </div>

      <div *ngIf="loading" class="loading">
        Loading...
      </div>

      <div *ngIf="error" class="error">
        Error: {{ error }}
      </div>
    </div>
  `,
  styles: [`
    .fragment-demo {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .demo-section {
      margin-bottom: 30px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }

    .demo-section h3 {
      margin-top: 0;
      color: #333;
    }

    button {
      background: #007bff;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 15px;
    }

    button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .todo-detail {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 4px;
    }

    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .todo-item {
      background: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
      gap: 10px;
      align-items: center;
    }

    .todo-item .title {
      font-weight: bold;
    }

    .stats {
      background: #e9ecef;
      padding: 15px;
      border-radius: 4px;
    }

    .loading {
      text-align: center;
      color: #666;
      font-style: italic;
    }

    .error {
      color: #dc3545;
      background: #f8d7da;
      padding: 10px;
      border-radius: 4px;
      margin-top: 10px;
    }
  `]
})
export class FragmentDemoComponent implements OnInit {
  fullTodo: Todo | null = null;
  basicTodos: Todo[] = [];
  todoList: Todo[] = [];
  stats: { todosCount: number; completedCount: number; pendingCount: number } | null = null;
  loading = false;
  error: string | null = null;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    // Subscribe to loading and error states
    this.todoService.loading$.subscribe(loading => this.loading = loading);
    this.todoService.error$.subscribe(error => this.error = error);
  }

  loadFullTodo(): void {
    // This would typically load a specific todo by ID
    // For demo purposes, we'll load the first todo with full details
    this.todoService.loadTodos({ limit: 1 }).subscribe(todos => {
      if (todos.length > 0) {
        this.todoService.getTodo(todos[0].id).subscribe(todo => {
          this.fullTodo = todo;
        });
      }
    });
  }

  loadBasicTodos(): void {
    this.todoService.loadTodosBasic({ limit: 5 }).subscribe(todos => {
      this.basicTodos = todos;
    });
  }

  loadTodoList(): void {
    this.todoService.loadTodos({ limit: 5 }).subscribe(todos => {
      this.todoList = todos;
    });
  }

  loadStats(): void {
    this.todoService.getTodoStats().subscribe(stats => {
      this.stats = stats;
    });
  }
} 