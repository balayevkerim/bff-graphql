import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';
import { Todo, Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-item',
  template: `
    <mat-card class="todo-card" [class.completed]="todo.completed">
      <mat-card-content>
        <div class="todo-header">
          <div class="todo-title">
            <mat-checkbox 
              [checked]="todo.completed"
              (change)="toggleTodo()"
              color="primary">
            </mat-checkbox>
            <h3 [class.completed-text]="todo.completed">{{ todo.title }}</h3>
          </div>
          
          <div class="todo-meta">
            <span class="priority-badge" [class]="todo.priority.toLowerCase()">
              {{ todo.priority }}
            </span>
            <span class="category-chip">{{ todo.category }}</span>
          </div>
        </div>
        
        <div class="todo-description" *ngIf="todo.description">
          <p>{{ todo.description }}</p>
        </div>
        
        <div class="todo-details">
          <div class="todo-dates">
            <span class="date-info" *ngIf="todo.dueDate">
              <mat-icon>event</mat-icon>
              Due: {{ todo.dueDate | date:'shortDate' }}
            </span>
            <span class="date-info">
              <mat-icon>schedule</mat-icon>
              Created: {{ todo.createdAt | date:'short' }}
            </span>
          </div>
          
          <div class="todo-actions">
            <button mat-icon-button (click)="editTodo()" matTooltip="Edit todo">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button (click)="deleteTodo()" matTooltip="Delete todo" color="warn">
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .todo-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .todo-title h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 500;
    }
    
    .completed-text {
      text-decoration: line-through;
      color: #666;
    }
    
    .todo-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .todo-meta {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .todo-description {
      margin-bottom: 16px;
    }
    
    .todo-description p {
      margin: 0;
      color: #666;
      line-height: 1.5;
    }
    
    .todo-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .todo-dates {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .date-info {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #666;
    }
    
    .date-info mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    
    .todo-actions {
      display: flex;
      gap: 4px;
    }
    
    @media (max-width: 600px) {
      .todo-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      
      .todo-details {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
      }
      
      .todo-dates {
        justify-content: flex-start;
      }
      
      .todo-actions {
        justify-content: flex-end;
      }
    }
  `]
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() todoUpdated = new EventEmitter<Todo>();
  @Output() todoDeleted = new EventEmitter<string>();

  constructor(
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  toggleTodo(): void {
    this.todoService.toggleTodo(this.todo.id).subscribe({
      next: (updatedTodo) => {
        this.todoUpdated.emit(updatedTodo);
        const status = updatedTodo.completed ? 'completed' : 'marked as pending';
        this.snackBar.open(`Todo ${status}!`, 'Close', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open(`Error updating todo: ${error.message}`, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    });
  }

  editTodo(): void {
    // This would typically open a dialog for editing
    // For now, we'll just show a message
    this.snackBar.open('Edit functionality coming soon!', 'Close', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top'
    });
  }

  deleteTodo(): void {
    if (confirm('Are you sure you want to delete this todo?')) {
      this.todoService.deleteTodo(this.todo.id).subscribe({
        next: (success) => {
          if (success) {
            this.todoDeleted.emit(this.todo.id);
            this.snackBar.open('Todo deleted successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        },
        error: (error) => {
          this.snackBar.open(`Error deleting todo: ${error.message}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
} 