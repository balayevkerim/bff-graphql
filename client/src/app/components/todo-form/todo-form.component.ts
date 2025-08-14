import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TodoService } from '../../services/todo.service';
import { Priority } from '../../models/todo.model';

@Component({
  selector: 'app-todo-form',
  template: `
    <mat-card class="todo-form">
      <mat-card-header>
        <mat-card-title>Add New Todo</mat-card-title>
      </mat-card-header>
      
      <mat-card-content>
        <form [formGroup]="todoForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Title *</mat-label>
              <input matInput formControlName="title" placeholder="Enter todo title">
              <mat-error *ngIf="todoForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
              <mat-error *ngIf="todoForm.get('title')?.hasError('maxlength')">
                Title must be less than 100 characters
              </mat-error>
            </mat-form-field>
            
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Priority</mat-label>
              <mat-select formControlName="priority">
                <mat-option *ngFor="let option of priorityOptions" [value]="option.value">
                  {{ option.label }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" 
                        placeholder="Enter todo description (optional)"
                        rows="3"></textarea>
            </mat-form-field>
            
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Category</mat-label>
              <input matInput formControlName="category" 
                     placeholder="Enter category"
                     [matAutocomplete]="auto">
              <mat-autocomplete #auto="matAutocomplete">
                <mat-option *ngFor="let category of categorySuggestions" [value]="category">
                  {{ category }}
                </mat-option>
              </mat-autocomplete>
            </mat-form-field>
          </div>
          
          <div class="form-row">
            <mat-form-field class="form-field" appearance="outline">
              <mat-label>Due Date</mat-label>
              <input matInput [matDatepicker]="picker" formControlName="dueDate">
              <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
              <mat-datepicker #picker></mat-datepicker>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="todoForm.invalid || isSubmitting">
                <mat-icon>add</mat-icon>
                {{ isSubmitting ? 'Adding...' : 'Add Todo' }}
              </button>
              
              <button mat-stroked-button type="button" (click)="resetForm()">
                <mat-icon>clear</mat-icon>
                Clear
              </button>
            </div>
          </div>
        </form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .form-actions {
      display: flex;
      gap: 10px;
      align-items: flex-end;
    }
    
    .form-actions button {
      min-width: 120px;
    }
    
    @media (max-width: 600px) {
      .form-actions {
        flex-direction: column;
        align-items: stretch;
      }
      
      .form-actions button {
        min-width: auto;
      }
    }
  `]
})
export class TodoFormComponent implements OnInit {
  todoForm: FormGroup;
  isSubmitting = false;
  priorityOptions = this.todoService.getPriorityOptions();
  categorySuggestions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {
    this.todoForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      priority: [Priority.MEDIUM],
      category: ['General'],
      dueDate: [null]
    });
  }

  ngOnInit(): void {
    // Load category suggestions
    this.todoService.todos$.subscribe(todos => {
      this.categorySuggestions = this.todoService.getCategorySuggestions();
    });
  }

  onSubmit(): void {
    if (this.todoForm.valid) {
      this.isSubmitting = true;
      
      const todoData = {
        ...this.todoForm.value,
        dueDate: this.todoForm.value.dueDate ? 
          this.todoForm.value.dueDate.toISOString().split('T')[0] : null
      };

      this.todoService.createTodo(todoData).subscribe({
        next: (todo) => {
          this.snackBar.open('Todo created successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.resetForm();
          this.isSubmitting = false;
        },
        error: (error) => {
          this.snackBar.open(`Error creating todo: ${error.message}`, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.isSubmitting = false;
        }
      });
    }
  }

  resetForm(): void {
    this.todoForm.reset({
      title: '',
      description: '',
      priority: Priority.MEDIUM,
      category: 'General',
      dueDate: null
    });
  }
} 