import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <mat-toolbar color="primary">
      <span>Todo BFF Application</span>
      <span class="toolbar-spacer"></span>
      <button mat-icon-button [matMenuTriggerFor]="menu">
        <mat-icon>more_vert</mat-icon>
      </button>
      <mat-menu #menu="matMenu">
        <button mat-menu-item (click)="refreshData()">
          <mat-icon>refresh</mat-icon>
          <span>Refresh</span>
        </button>
        <button mat-menu-item (click)="showAbout()">
          <mat-icon>info</mat-icon>
          <span>About BFF</span>
        </button>
      </mat-menu>
    </mat-toolbar>

    <div class="todo-container">
      <div class="todo-header">
        <h1>Todo Management</h1>
        <p>Built with GraphQL BFF Architecture</p>
      </div>

      <app-dashboard></app-dashboard>
      
      <app-todo-form></app-todo-form>
      
      <app-todo-list></app-todo-list>
    </div>
  `,
  styles: [`
    .toolbar-spacer {
      flex: 1 1 auto;
    }
    
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
  `]
})
export class AppComponent {
  title = 'Todo BFF App';

  refreshData(): void {
    // This will be handled by the todo service
    window.location.reload();
  }

  showAbout(): void {
    alert(`Todo BFF Application

This application demonstrates the Backend for Frontend (BFF) architecture pattern.

Key Features:
• GraphQL API optimized for Angular frontend
• Real-time data synchronization
• Optimized queries and mutations
• Frontend-specific business logic
• Better performance and developer experience

BFF Benefits:
• Reduced network overhead
• Optimized data fetching
• Frontend-specific APIs
• Better error handling
• Improved caching strategies`);
  }
} 