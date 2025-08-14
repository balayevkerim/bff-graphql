import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from '../../services/todo.service';
import { Todo } from '../../models/todo.model';

@Component({
  selector: 'app-todo-list',
  template: `
    <div class="todo-list-container">
      <div class="list-header">
        <h2>Todos</h2>
        <div class="list-actions">
          <button mat-stroked-button (click)="refreshTodos()">
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </div>

      <div class="loading-spinner" *ngIf="loading$ | async">
        <mat-spinner diameter="40"></mat-spinner>
        <p>Loading todos...</p>
      </div>

      <div class="error-message" *ngIf="error$ | async as error">
        <mat-icon>error</mat-icon>
        <p>{{ error }}</p>
        <button mat-raised-button color="primary" (click)="refreshTodos()">
          Try Again
        </button>
      </div>

      <div class="empty-state" *ngIf="(todos$ | async)?.length === 0 && !(loading$ | async) && !(error$ | async)">
        <mat-icon>assignment</mat-icon>
        <h3>No todos yet</h3>
        <p>Create your first todo to get started!</p>
      </div>

      <div class="todo-items" *ngIf="(todos$ | async)?.length">
        <app-todo-item 
          *ngFor="let todo of todos$ | async" 
          [todo]="todo"
          (todoUpdated)="onTodoUpdated($event)"
          (todoDeleted)="onTodoDeleted($event)">
        </app-todo-item>
      </div>

      <div class="list-footer" *ngIf="(todos$ | async)?.length">
        <p class="todo-count">
          Showing {{ (todos$ | async)?.length }} todo(s)
        </p>
      </div>
    </div>
  `,
  styles: [`
    .todo-list-container {
      margin-top: 20px;
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .list-header h2 {
      margin: 0;
      color: #333;
    }
    
    .list-actions {
      display: flex;
      gap: 10px;
    }
    
    .todo-items {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }
    
    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      margin: 0 0 10px 0;
      color: #333;
    }
    
    .empty-state p {
      margin: 0;
      font-size: 16px;
    }
    
    .list-footer {
      margin-top: 20px;
      text-align: center;
    }
    
    .todo-count {
      color: #666;
      font-size: 14px;
      margin: 0;
    }
    
    @media (max-width: 600px) {
      .list-header {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;
      }
      
      .list-actions {
        justify-content: center;
      }
    }
  `]
})
export class TodoListComponent implements OnInit {
  todos$ = this.todoService.todos$;
  loading$ = this.todoService.loading$;
  error$ = this.todoService.error$;

  constructor(private todoService: TodoService) {
    console.log('TodoListComponent initialized');
  }

  ngOnInit(): void {
    console.log('TodoListComponent ngOnInit');
    // Don't call loadTodos here since DashboardComponent already calls it
    // Just observe the existing data stream
  }

  refreshTodos(): void {
    console.log('Refreshing todos...');
    this.todoService.clearError();
    this.todoService.loadTodos().subscribe({
      next: (todos) => {
        console.log('Todos refreshed successfully:', todos);
      },
      error: (error) => {
        console.error('Error refreshing todos:', error);
      }
    });
  }

  onTodoUpdated(todo: Todo): void {
    console.log('Todo updated:', todo);
  }

  onTodoDeleted(todoId: string): void {
    console.log('Todo deleted:', todoId);
  }
} 