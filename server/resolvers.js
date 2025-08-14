const todoService = require('./services/todoService');

const resolvers = {
  Query: {
    // Get all todos with filtering and pagination
    todos: async (_, { completed, category, priority, limit, offset }) => {
      try {
        const filters = {};
        if (completed !== undefined) filters.completed = completed;
        if (category) filters.category = category;
        if (priority) filters.priority = priority;
        if (limit) filters.limit = limit;
        if (offset) filters.offset = offset;
        
        return await todoService.getAllTodos(filters);
      } catch (error) {
        console.error('Error fetching todos:', error);
        throw new Error('Failed to fetch todos');
      }
    },
    
    // Get specific todo by ID
    todo: async (_, { id }) => {
      try {
        const todo = await todoService.getTodoById(id);
        if (!todo) {
          throw new Error('Todo not found');
        }
        return todo;
      } catch (error) {
        console.error('Error fetching todo:', error);
        throw error;
      }
    },
    
    // Get todos count for pagination
    todosCount: async (_, { completed }) => {
      try {
        const filters = {};
        if (completed !== undefined) filters.completed = completed;
        return await todoService.getTodosCount(filters);
      } catch (error) {
        console.error('Error counting todos:', error);
        throw new Error('Failed to count todos');
      }
    },
    
    // Get todos by category
    todosByCategory: async (_, { category }) => {
      try {
        return await todoService.getTodosByCategory(category);
      } catch (error) {
        console.error('Error fetching todos by category:', error);
        throw new Error('Failed to fetch todos by category');
      }
    },
    
    // Get completed todos count for dashboard
    completedTodosCount: async () => {
      try {
        return await todoService.getCompletedTodosCount();
      } catch (error) {
        console.error('Error counting completed todos:', error);
        throw new Error('Failed to count completed todos');
      }
    },
    
    // Get pending todos count for dashboard
    pendingTodosCount: async () => {
      try {
        return await todoService.getPendingTodosCount();
      } catch (error) {
        console.error('Error counting pending todos:', error);
        throw new Error('Failed to count pending todos');
      }
    }
  },
  
  Mutation: {
    // Create new todo
    createTodo: async (_, { input }) => {
      try {
        // BFF-specific validation
        if (!input.title || input.title.trim().length === 0) {
          throw new Error('Title is required');
        }
        
        return await todoService.createTodo(input);
      } catch (error) {
        console.error('Error creating todo:', error);
        throw error;
      }
    },
    
    // Update existing todo
    updateTodo: async (_, { id, input }) => {
      try {
        // BFF-specific validation
        if (input.title && input.title.trim().length === 0) {
          throw new Error('Title cannot be empty');
        }
        
        return await todoService.updateTodo(id, input);
      } catch (error) {
        console.error('Error updating todo:', error);
        throw error;
      }
    },
    
    // Delete todo
    deleteTodo: async (_, { id }) => {
      try {
        return await todoService.deleteTodo(id);
      } catch (error) {
        console.error('Error deleting todo:', error);
        throw error;
      }
    },
    
    // Toggle todo completion
    toggleTodo: async (_, { id }) => {
      try {
        return await todoService.toggleTodo(id);
      } catch (error) {
        console.error('Error toggling todo:', error);
        throw error;
      }
    },
    
    // Mark multiple todos as completed (batch operation)
    markTodosCompleted: async (_, { ids }) => {
      try {
        if (!ids || ids.length === 0) {
          throw new Error('No todo IDs provided');
        }
        
        return await todoService.markTodosCompleted(ids);
      } catch (error) {
        console.error('Error marking todos as completed:', error);
        throw error;
      }
    },
    
    // Delete multiple todos (batch operation)
    deleteTodos: async (_, { ids }) => {
      try {
        if (!ids || ids.length === 0) {
          throw new Error('No todo IDs provided');
        }
        
        return await todoService.deleteTodos(ids);
      } catch (error) {
        console.error('Error deleting todos:', error);
        throw error;
      }
    },
    
    // Update todo priority
    updateTodoPriority: async (_, { id, priority }) => {
      try {
        return await todoService.updateTodo(id, { priority });
      } catch (error) {
        console.error('Error updating todo priority:', error);
        throw error;
      }
    }
  },
  
  // Field resolvers for computed values
  Todo: {
    // Format dates for Angular frontend
    createdAt: (parent) => {
      return new Date(parent.createdAt).toISOString();
    },
    
    updatedAt: (parent) => {
      return new Date(parent.updatedAt).toISOString();
    },
    
    // Ensure description is never null
    description: (parent) => {
      return parent.description || '';
    },
    
    // Ensure category has a default value
    category: (parent) => {
      return parent.category || 'General';
    },
    
    // Ensure priority has a default value
    priority: (parent) => {
      return parent.priority || 'MEDIUM';
    }
  }
};

module.exports = resolvers; 