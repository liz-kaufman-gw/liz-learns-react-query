import React from 'react'
import ListItem from '../ListItem'
import { useQuery } from 'react-query';

async function fetchTodos() {
    const response = await fetch('http://localhost:3003/todos');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

const List = () => {
    const { isLoading, isError, data: todos, error } = useQuery('todos', fetchTodos, {
        onError: (error) => {
            console.error('Error fetching todos: ', error)
        }
    });

    if (isLoading){
        return <h2>Loading...</h2>
    }

    if (isError){
        return <h2>Error: {error.message}</h2>
    }

    return (
        <ul className='list'>
            {todos.map((todo)=> <ListItem key={todo.id} title={todo.title} isCompleted={todo.isCompleted} />)}
        </ul>
    )
}

export default List