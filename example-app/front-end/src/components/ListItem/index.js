import React from 'react'

const ListItem = ({title, isCompleted}) => {   
    return (
        <li>
            <input type='checkbox' />
           {title}
        </li>
    )
}

export default ListItem