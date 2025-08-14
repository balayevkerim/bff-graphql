import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div class="dashboard-stats">
      <div class="stat-card">
        <div class="stat-number">{{ (totalTodos$ | async) || 0 }}</div>
        <div class="stat-label">Total Todos</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-number">{{ (completedTodos$ | async) || 0 }}</div>
        <div class="stat-label">Completed</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-number">{{ (pendingTodos$ | async) || 0 }}</div>
        <div class="stat-label">Pending</div>
      </div>
      
      <div class="stat-card">
        <div class="stat-number">{{ (completionRate$ | async) || 0 | number:'1.0-0' }}%</div>
        <div class="stat-label">Completion Rate</div>
      </div>
    </div>

    <div class="dashboard-filters" *ngIf="(todos$ | async)?.length">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Quick Filters</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="filter-buttons">
            <button mat-stroked-button 
                    [class.active]="currentFilter === 'all'"
                    (click)="setFilter('all')">
              All ({{ (totalTodos$ | async) || 0 }})
            </button>
            <button mat-stroked-button 
                    [class.active]="currentFilter === 'pending'"
                    (click)="setFilter('pending')">
              Pending ({{ (pendingTodos$ | async) || 0 }})
            </button>
            <button mat-stroked-button 
                    [class.active]="currentFilter === 'completed'"
                    (click)="setFilter('completed')">
              Completed ({{ (completedTodos$ | async) || 0 }})
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .dashboard-filters {
      margin-bottom: 20px;
    }
    
    .filter-buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    
    .filter-buttons button {
      min-width: 120px;
    }
    
    .filter-buttons button.active {
      background-color: #3f51b5;
      color: white;
    }
    
    @media (max-width: 600px) {
      .filter-buttons {
        flex-direction: column;
      }
      
      .filter-buttons button {
        min-width: auto;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  todos$ = this.todoService.todos$;
  totalTodos$ = this.todoService.getTodosCount();
  completedTodos$ = this.todoService.getCompletedCount();
  pendingTodos$ = this.todoService.getPendingCount();
  
  completionRate$ = combineLatest([
    this.completedTodos$,
    this.totalTodos$
  ]).pipe(
    map(([completed, total]) => total > 0 ? (completed / total) * 100 : 0)
  );

  currentFilter = 'all';

  constructor(private todoService: TodoService) {
    console.log('DashboardComponent initialized');
  }

  ngOnInit(): void {
    console.log('DashboardComponent ngOnInit - calling loadTodos');
    // Load initial data
    this.todoService.loadTodos().subscribe({
      next: (todos) => {
        console.log('Dashboard: Todos loaded successfully:', todos);
      },
      error: (error) => {
        console.error('Dashboard: Error loading todos:', error);
      }
    });
  }

  setFilter(filter: 'all' | 'pending' | 'completed'): void {
    console.log('Setting filter:', filter);
    this.currentFilter = filter;
    
    const filters: any = {};
    if (filter === 'pending') {
      filters.completed = false;
    } else if (filter === 'completed') {
      filters.completed = true;
    }
    
    this.todoService.loadTodos(filters).subscribe({
      next: (todos) => {
        console.log('Filtered todos loaded:', todos);
      },
      error: (error) => {
        console.error('Error loading filtered todos:', error);
      }
    });
  }
} 