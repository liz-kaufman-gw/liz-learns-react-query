import React from 'react'
import ListItem from '../ListItem'

async function fetchTodos() {
    const response = await fetch('http://localhost:8000/todos')
}

const List = () => {
    return (
        <ul>
            <ListItem />
        </ul>
    )
}

export default List