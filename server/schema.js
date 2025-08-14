const { gql } = require('apollo-server-express');

const typeDefs = gql`
  # Todo type definition - optimized for Angular frontend
  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
    createdAt: String!
    updatedAt: String!
    # Additional fields that might be useful for Angular UI
    priority: Priority
    category: String
    dueDate: String
  }

  # Input type for creating/updating todos
  input TodoInput {
    title: String!
    description: String
    priority: Priority
    category: String
    dueDate: String
  }

  # Priority enum for better UX
  enum Priority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  # Query type - optimized for Angular data fetching patterns
  type Query {
    # Get all todos with optional filtering
    todos(
      completed: Boolean
      category: String
      priority: Priority
      limit: Int
      offset: Int
    ): [Todo!]!
    
    # Get a specific todo by ID
    todo(id: ID!): Todo
    
    # Get todos count for pagination
    todosCount(completed: Boolean): Int!
    
    # Get todos by category for Angular filtering
    todosByCategory(category: String!): [Todo!]!
    
    # Get completed todos count for dashboard
    completedTodosCount: Int!
    
    # Get pending todos count for dashboard
    pendingTodosCount: Int!
  }

  # Mutation type - optimized for Angular CRUD operations
  type Mutation {
    # Create a new todo
    createTodo(input: TodoInput!): Todo!
    
    # Update an existing todo
    updateTodo(id: ID!, input: TodoInput!): Todo!
    
    # Delete a todo
    deleteTodo(id: ID!): Boolean!
    
    # Toggle todo completion status
    toggleTodo(id: ID!): Todo!
    
    # Mark multiple todos as completed
    markTodosCompleted(ids: [ID!]!): [Todo!]!
    
    # Delete multiple todos
    deleteTodos(ids: [ID!]!): Boolean!
    
    # Update todo priority
    updateTodoPriority(id: ID!, priority: Priority!): Todo!
  }

  # Subscription type for real-time updates (future enhancement)
  type Subscription {
    todoCreated: Todo!
    todoUpdated: Todo!
    todoDeleted: ID!
  }
`;

module.exports = typeDefs; 