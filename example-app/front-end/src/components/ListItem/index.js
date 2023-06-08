import React from 'react'

const ListItem = ({title, isCompleted}) => {   
    return (
        <li className='list-item'>
            <input type='checkbox' />
           {title}
        </li>
    )
}

export default ListItem