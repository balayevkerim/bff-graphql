# GraphQL Fragments Demo

This demo shows how to use GraphQL fragments in your Angular todo application to improve code organization, reusability, and performance.

## What are GraphQL Fragments?

GraphQL fragments are reusable pieces of GraphQL query logic that allow you to:
- **Reduce duplication**: Define field selections once and reuse them
- **Improve maintainability**: Update field selections in one place
- **Optimize performance**: Request only the fields you need for different use cases
- **Better organization**: Structure your queries more clearly

## Fragments in Our Todo App

### 1. `TodoFields` Fragment
```graphql
fragment TodoFields on Todo {
  id
  title
  description
  completed
  priority
  category
  dueDate
  createdAt
  updatedAt
}
```
This is our base fragment containing all Todo fields.

### 2. `TodoBasicFields` Fragment
```graphql
fragment TodoBasicFields on Todo {
  id
  title
  completed
  priority
  category
  dueDate
}
```
A lightweight fragment for list views where you don't need descriptions or timestamps.

### 3. `TodoDetailedFields` Fragment
```graphql
fragment TodoDetailedFields on Todo {
  ...TodoFields
  # Future: Add additional fields like tags, assignee, comments
}
```
Extends the base fragment for detail views with potential for additional fields.

### 4. `TodoListItem` Fragment
```graphql
fragment TodoListItem on Todo {
  ...TodoBasicFields
  description
  createdAt
}
```
Combines basic fields with description and creation date for list items.

## How to Use Fragments

### In Queries
```typescript
const GET_TODOS = gql`
  query GetTodos($completed: Boolean, $category: String, $priority: Priority, $limit: Int, $offset: Int) {
    todos(completed: $completed, category: $category, priority: $priority, limit: $limit, offset: $offset) {
      ...TodoListItem
    }
  }
  ${TODO_LIST_ITEM}
`;
```

### In Mutations
```typescript
const CREATE_TODO = gql`
  mutation CreateTodo($input: TodoInput!) {
    createTodo(input: $input) {
      ...TodoFields
    }
  }
  ${TODO_FIELDS}
`;
```

## Benefits Demonstrated

### 1. **Performance Optimization**
- Use `TodoBasicFields` for lightweight list views
- Use `TodoDetailedFields` for full detail views
- Only fetch the data you actually need

### 2. **Code Reusability**
- Define field selections once in fragments
- Reuse across multiple queries and mutations
- Easy to maintain and update

### 3. **Type Safety**
- Fragments work seamlessly with TypeScript
- Apollo Client generates proper types
- Compile-time checking of field selections

### 4. **Flexibility**
- Mix and match fragments for different use cases
- Extend fragments as your schema evolves
- Create specialized fragments for specific components

## Usage Examples

### For List Views (Performance)
```typescript
// Use basic fields for better performance
this.todoService.loadTodosBasic({ limit: 10 }).subscribe(todos => {
  // Only gets id, title, completed, priority, category, dueDate
});
```

### For Detail Views (Full Data)
```typescript
// Use detailed fields for complete information
this.todoService.getTodo(id).subscribe(todo => {
  // Gets all fields including description, timestamps, etc.
});
```

### For Statistics (No Fragments Needed)
```typescript
// Some queries don't need fragments
this.todoService.getTodoStats().subscribe(stats => {
  // Simple count queries
});
```

## Best Practices

1. **Start with a base fragment** containing all commonly used fields
2. **Create specialized fragments** for specific use cases (list vs detail)
3. **Use fragments consistently** across your application
4. **Keep fragments close to their usage** or in a dedicated fragments file
5. **Document your fragments** so other developers understand their purpose

## Next Steps

- Add more specialized fragments as your app grows
- Consider creating fragments for related types (User, Category, etc.)
- Implement fragment composition for complex queries
- Use fragments with Apollo Client's cache policies for optimal performance 