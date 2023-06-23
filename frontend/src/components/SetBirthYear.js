import React, { useState } from 'react';
import { EDIT_AUTHOR, ALL_BOOKS, ALL_AUTHORS } from '../queries';
import { useMutation, useQuery } from '@apollo/client';

const SetBirthYear = () => {
    const allAuthors = useQuery(ALL_AUTHORS);

    const [name, setName] = useState('');
    const [born, setBorn] = useState('');

    const [editAuthor] = useMutation(EDIT_AUTHOR, {refetchQueries: [{query: ALL_AUTHORS}, {query: ALL_BOOKS}]});

    const handleSubmit = (e) => {
        e.preventDefault();
        editAuthor({variables: {name, born: Number(born)}});
        setName('');
        setBorn('');
    }


    if(allAuthors.loading){
        return (
          <p>loading...</p>
        )
      }
  return (
    <div>
        <h2>Set birth year</h2>
        <form onSubmit={handleSubmit}>
            author
            <select onChange={({ target }) => setName(target.value)}>
                {allAuthors.data && allAuthors.data.allAuthors.map(i => <option  key={i.name} value={i.name}>{i.name}</option>)}
            </select>
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