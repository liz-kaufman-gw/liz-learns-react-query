# Learning React Query

## Resources

- [React Query in 100 Seconds](https://www.youtube.com/watch?v=novnyCaa7To)
- [React Query Docs: Quick Start](https://tanstack.com/query/v3/docs/react/quick-start)
- [TkDodo's Blog](https://tanstack.com/query/latest/docs/react/community/tkdodos-blog#12-mastering-mutations-in-react-query) - written by a maintainer of the library

## Notes - BASICS

### Queries

*Queries* are the operations used to fetch data.

- Used to get data (e.g. GET requests)
- Can automatically retry failed requests
- Gives useful info about the query's state (loading, error, success, etc.)

**`useQuery`**

This is the hook to fetch and manage data.

It takes in:

- *Unique key* for the query (ex - 'todos' for fetching a list of todos) - used for refetching, caching, and sharing query within the application
- *Function* that returns a promise that either resolves with the data or errors

It returns a *result* object that contains:

- State of the query; this can only be in one of these:
  - `isLoading` or `status === 'loading'` - The query has no data and is currently fetching
  - `isError` or `status === 'error'` - The query encountered an error
  - `isSuccess` or `status === 'success'` - The query was successful and data is available
  - `isIdle` or `status === 'idle'` - The query is currently disabled
- More info available depending on state:
  - If in `isError` state: `error` property with error message
  - If in `success` state: `data` property with data
  - `isFetching` -> boolean property; if query is in a state where it's actually fetching (including refetching in the background), this will be true

You can check the state using the boolean or using the status property, and you can use these to show loading mesages, error messages, and success messages in your UI.

Example from [docs](https://tanstack.com/query/v3/docs/react/guides/queries):

```tsx
function Todos() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodoList,
  })

  if (isLoading) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  // We can assume by this point that `isSuccess === true`
  return (
    <ul>
      {data.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  )
}
```

### Mutations

*Mutations* are operations used to change (or potentially change) remote data, e.g. POST, PUT, PATCH, or DELETE.

**`useMutation`**

This hook handles mutations. Mutations are usually done manually (like triggering with a function call). This is usually in response to a user action (like a form submission).

Mutations take one argument, a callback function that performs the request. This function needs to take in a parameter that will be the information passed into the request. For example:

```ts
const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
})
```

`useMutation` returns an object that contains similar state info and error/data properties to `useQuery`:

- State of the query; this can only be in one of these:
  - `isLoading` or `status === 'loading'` - The mutation is currently running
  - `isError` or `status === 'error'` - The mutation encountered an error
  - `isSuccess` or `status === 'success'` - The mutation was successful and mutation data is available
  - `isIdle` or `status === 'idle'` - The mutation is currently idle or in a fresh/reset state
- More info available depending on state:
  - If in `isError` state: `error` property with error message
  - If in `success` state: `data` property with data
- Methods:
  - `mutate`
  - `reset`

**`mutate` method**

- This is where you invoke the callback function you passed to `useMutation` initially.
- Whatever argument(s) you hand to `mutate` will be passed into the callback function.
- Key difference from `useQuery`: The mutation only happens when `mutate` is called, whereas `useQuery` happens automatically when the component renders.
- `mutate` is async!

```tsx
function App() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return axios.post('/todos', newTodo)
    },
  })

  return (
    <div>
      {mutation.isLoading ? (
        'Adding todo...'
      ) : (
        <>
          {mutation.isError ? (
            <div>An error occurred: {mutation.error.message}</div>
          ) : null}

          {mutation.isSuccess ? <div>Todo added!</div> : null}

          <button
            onClick={() => {
              mutation.mutate({ id: new Date(), title: 'Do Laundry' })
            }}
          >
            Create Todo
          </button>
        </>
      )}
    </div>
  )
}
```

**`reset` method**

This lets you clear the `error` or `data` of a mutation request.

```tsx
const CreateTodo = () => {
  const [title, setTitle] = useState('')
  const mutation = useMutation({ mutationFn: createTodo })

  const onCreateTodo = (e) => {
    e.preventDefault()
    mutation.mutate({ title })
  }

  return (
    <form onSubmit={onCreateTodo}>
      {mutation.error && (
        <h5 onClick={() => mutation.reset()}>{mutation.error}</h5>
      )}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br />
      <button type="submit">Create Todo</button>
    </form>
  )
}
```

🧠 [Click here](#mutation-side-effects) for more advanced tools and concepts within mutations.

### Query Invalidation

### Example from [docs](https://tanstack.com/query/v3/docs/react/quick-start)

```js
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { getTodos, postTodo } from '../my-api'

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <Todos />
    </QueryClientProvider>
  )
}

function Todos() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery('todos', getTodos)

  // Mutations
  const mutation = useMutation(postTodo, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries('todos')
    },
  })

  return (
    <div>
      <ul>
        {query.data.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>

      <button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </button>
    </div>
  )
}

render(<App />, document.getElementById('root'))
```

## Notes - ADVANCED

### Mutation side effects

[TBC - using this info](https://tanstack.com/query/v3/docs/react/guides/mutations#mutation-side-effects)
