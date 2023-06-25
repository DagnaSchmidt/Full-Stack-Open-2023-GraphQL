import React, { useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from '../queries';

const Recommendations = (props) => {
    const [list, setList] = useState([]);
    console.log(list);

    const result = useQuery(ME);
    const favoriteGenre = result.data && result.data.me.favoriteGenre;

    const books = useQuery(ALL_BOOKS, {variables: {genre: favoriteGenre}});

    console.log(result);

    useEffect(() => {
        if(books.data){
          setList(books.data.allBooks);
        }
      }, [books.data]);

    if (!props.show) {
        return null
      }
  return (
    <div>
        <h2>books</h2>

        <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {list &&  list.map((a) => (
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>

    </div>
  )
}

export default Recommendations;