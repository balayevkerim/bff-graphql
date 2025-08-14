const { v4: uuidv4 } = require('uuid');

// In-memory storage for demo purposes
// In a real application, this would be a database
let todos = [
  {
    id: '1',
    title: 'Learn GraphQL',
    description: 'Understand GraphQL basics and Apollo Server',
    completed: false,
    priority: 'HIGH',
    category: 'Learning',
    dueDate: '2024-01-15',
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z'
  },
  {
    id: '2',
    title: 'Build BFF Architecture',
    description: 'Implement Backend for Frontend pattern',
    completed: false,
    priority: 'URGENT',
    category: 'Development',
    dueDate: '2024-01-20',
    createdAt: '2024-01-01T11:00:00Z',
    updatedAt: '2024-01-01T11:00:00Z'
  },
  {
    id: '3',
    title: 'Create Angular Frontend',
    description: 'Build responsive Angular UI for todo app',
    completed: true,
    priority: 'MEDIUM',
    category: 'Frontend',
    dueDate: '2024-01-10',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z'
  }
];

class TodoService {
  // Get all todos with BFF-specific filtering and optimization
  async getAllTodos(filters = {}) {
    let filteredTodos = [...todos];
    
    // Apply filters - optimized for Angular frontend needs
    if (filters.completed !== undefined) {
      filteredTodos = filteredTodos.filter(todo => todo.completed === filters.completed);
    }
    
    if (filters.category) {
      filteredTodos = filteredTodos.filter(todo => 
        todo.category?.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.priority) {
      filteredTodos = filteredTodos.filter(todo => todo.priority === filters.priority);
    }
    
    // Apply pagination for better performance
    if (filters.limit || filters.offset) {
      const offset = filters.offset || 0;
      const limit = filters.limit || filteredTodos.length;
      filteredTodos = filteredTodos.slice(offset, offset + limit);
    }
    
    // Sort by priority and creation date for better UX
    filteredTodos.sort((a, b) => {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const aPriority = priorityOrder[a.priority] || 0;
      const bPriority = priorityOrder[b.priority] || 0;
      
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    return filteredTodos;
  }
  
  // Get todo by ID
  async getTodoById(id) {
    return todos.find(todo => todo.id === id);
  }
  
  // Create new todo with BFF-specific validation
  async createTodo(todoData) {
    const now = new Date().toISOString();
    const newTodo = {
      id: uuidv4(),
      title: todoData.title.trim(),
      description: todoData.description?.trim() || '',
      completed: false,
      priority: todoData.priority || 'MEDIUM',
      category: todoData.category?.trim() || 'General',
      dueDate: todoData.dueDate || null,
      createdAt: now,
      updatedAt: now
    };
    
    // BFF-specific validation
    if (!newTodo.title) {
      throw new Error('Title is required');
    }
    
    if (newTodo.title.length > 100) {
      throw new Error('Title must be less than 100 characters');
    }
    
    todos.push(newTodo);
    return newTodo;
  }
  
  // Update todo with optimistic updates for Angular
  async updateTodo(id, updateData) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    const updatedTodo = {
      ...todos[todoIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    // BFF-specific validation
    if (updateData.title && updateData.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }
    
    todos[todoIndex] = updatedTodo;
    return updatedTodo;
  }
  
  // Delete todo
  async deleteTodo(id) {
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex === -1) {
      throw new Error('Todo not found');
    }
    
    todos.splice(todoIndex, 1);
    return true;
  }
  
  // Toggle todo completion - optimized for Angular UI
  async toggleTodo(id) {
    const todo = await this.getTodoById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    
    return await this.updateTodo(id, { completed: !todo.completed });
  }
  
  // Bulk operations for Angular batch actions
  async markTodosCompleted(ids) {
    const updatedTodos = [];
    for (const id of ids) {
      try {
        const updatedTodo = await this.updateTodo(id, { completed: true });
        updatedTodos.push(updatedTodo);
      } catch (error) {
        console.error(`Failed to update todo ${id}:`, error.message);
      }
    }
    return updatedTodos;
  }
  
  async deleteTodos(ids) {
    let successCount = 0;
    for (const id of ids) {
      try {
        await this.deleteTodo(id);
        successCount++;
      } catch (error) {
        console.error(`Failed to delete todo ${id}:`, error.message);
      }
    }
    return successCount === ids.length;
  }
  
  // Get counts for Angular dashboard
  async getTodosCount(filters = {}) {
    const filteredTodos = await this.getAllTodos(filters);
    return filteredTodos.length;
  }
  
  async getCompletedTodosCount() {
    return await this.getTodosCount({ completed: true });
  }
  
  async getPendingTodosCount() {
    return await this.getTodosCount({ completed: false });
  }
  
  // Get todos by category for Angular filtering
  async getTodosByCategory(category) {
    return await this.getAllTodos({ category });
  }
  
  // BFF-specific method for Angular search functionality
  async searchTodos(searchTerm) {
    if (!searchTerm) return todos;
    
    const term = searchTerm.toLowerCase();
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(term) ||
      todo.description.toLowerCase().includes(term) ||
      todo.category.toLowerCase().includes(term)
    );
  }
  
  // Get analytics data for Angular dashboard
  async getAnalytics() {
    const total = todos.length;
    const completed = await this.getCompletedTodosCount();
    const pending = await this.getPendingTodosCount();
    
    const priorityStats = todos.reduce((acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1;
      return acc;
    }, {});
    
    const categoryStats = todos.reduce((acc, todo) => {
      acc[todo.category] = (acc[todo.category] || 0) + 1;
      return acc;
    }, {});
    
    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      priorityStats,
      categoryStats
    };
  }
}

module.exports = new TodoService(); 