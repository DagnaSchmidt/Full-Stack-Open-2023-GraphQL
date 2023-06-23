import React, { useState } from 'react';
import { EDIT_AUTHOR, ALL_BOOKS, ALL_PERSONS } from '../queries';
import { useMutation } from '@apollo/client';

const SetBirthYear = () => {
    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const [editAuthor] = useMutation(EDIT_AUTHOR, {refetchQueries: [{query: ALL_PERSONS}, {query: ALL_BOOKS}]});

    const handleSubmit = (e) => {
        e.preventDefault();
        editAuthor({variables: {name, born: Number(born)}});
        setName('');
        setBorn('');
    }

  return (
    <div>
        <h2>Set birth year</h2>
        <form onSubmit={handleSubmit}>
            author
            <input 
                value={name}
                onChange={({ target }) => setName(target.value)}
            />
            born 
            <input 
                value={born}
                type='number'
                onChange={({target}) => setBorn(target.value)}
            />
            <button>update author</button>
        </form>
    </div>
  )
}

export default SetBirthYear;