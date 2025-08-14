export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export interface TodoInput {
  title: string;
  description?: string;
  priority?: Priority;
  category?: string;
  dueDate?: string;
}

export interface TodoFilters {
  completed?: boolean;
  category?: string;
  priority?: Priority;
  limit?: number;
  offset?: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  completionRate: number;
  priorityStats: Record<Priority, number>;
  categoryStats: Record<string, number>;
} 