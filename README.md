# Todo BFF Application

A simple todo application demonstrating BFF (Backend for Frontend) architecture with GraphQL API and Angular frontend.

## BFF Architecture Overview

This project implements the **Backend for Frontend (BFF)** pattern, which creates specialized backend services tailored to specific frontend applications.

### Architecture Benefits:
- **Optimized Data Fetching**: BFF aggregates data and returns exactly what the frontend needs
- **Reduced Network Overhead**: Fewer API calls and smaller payloads
- **Frontend-Specific Logic**: Backend logic tailored to Angular frontend requirements
- **Better Performance**: Optimized GraphQL queries and caching
- **Easier Frontend Development**: APIs designed specifically for Angular needs

### Project Structure:
```
todo-bff/
├── server/                 # BFF GraphQL Server
│   ├── index.js           # Main server file
│   ├── schema/            # GraphQL schema definitions
│   ├── resolvers/         # GraphQL resolvers
│   └── services/          # Business logic services
├── client/                # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   │   └── models/
│   │   └── ...
│   └── ...
└── package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Angular CLI (for frontend development)

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - GraphQL Playground: http://localhost:4000/graphql
   - Angular Frontend: http://localhost:4200

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build both server and client
- `npm run install:all` - Install dependencies for both server and client

## GraphQL API

The BFF provides a GraphQL API with the following operations:

### Queries:
- `todos` - Get all todos
- `todo(id: ID!)` - Get a specific todo by ID

### Mutations:
- `createTodo(input: TodoInput!)` - Create a new todo
- `updateTodo(id: ID!, input: TodoInput!)` - Update an existing todo
- `deleteTodo(id: ID!)` - Delete a todo
- `toggleTodo(id: ID!)` - Toggle todo completion status

### Types:
```graphql
type Todo {
  id: ID!
  title: String!
  description: String
  completed: Boolean!
  createdAt: String!
  updatedAt: String!
}

input TodoInput {
  title: String!
  description: String
}
```

## BFF Implementation Details

### Why BFF for This Todo App?

1. **Data Aggregation**: BFF can combine todo data with user preferences, categories, and other related data
2. **Frontend Optimization**: GraphQL queries are optimized for Angular's specific data needs
3. **Caching Strategy**: BFF implements caching strategies beneficial for the Angular frontend
4. **Error Handling**: Centralized error handling tailored for Angular's error display patterns

### BFF vs Traditional API

**Traditional Approach:**
```
Angular App → REST API → Database
```

**BFF Approach:**
```
Angular App → GraphQL BFF → Database
```

The BFF provides:
- GraphQL interface for flexible queries
- Optimized data fetching
- Frontend-specific business logic
- Better developer experience

## Development

### Adding New Features

1. **Backend (BFF):**
   - Add new types to `server/schema/`
   - Implement resolvers in `server/resolvers/`
   - Add business logic in `server/services/`

2. **Frontend (Angular):**
   - Create components in `client/src/app/components/`
   - Add services in `client/src/app/services/`
   - Update GraphQL queries in `client/src/app/graphql/`
