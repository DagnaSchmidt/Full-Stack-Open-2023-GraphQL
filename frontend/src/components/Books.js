import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ALL_GENRES } from "../queries";
import { useEffect, useState } from "react";

const Books = (props) => {
  const [list, setList] = useState([]);
  const result = useQuery(ALL_BOOKS);
  const allGenres = useQuery(ALL_GENRES);

  useEffect(() => {
    if(result.data){
      setList(result.data.allBooks);
    }
  }, [result.data]);
  
  const GenreBtn = ({genre, setList}) => {
    const newResult = useQuery(ALL_BOOKS, {variables: {genre: genre}});

    const handleFilter = () => {
      setList(newResult.data.allBooks);
    }

    return (
      <button onClick={() => handleFilter()}>{genre}</button>
    )
  }


    if(result.loading){
      return (
        <p>loading...</p>
      )
    }
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

        {allGenres.data && allGenres.data.allGenres.map(i => <GenreBtn key={i} genre={i} setList={setList} />)}

      </div>
    )
  }
  
  export default Books;