import { useQuery } from "@apollo/client";

import { ALL_PERSONS } from "../queries";
import { useState } from "react";

const Authors = (props) => {
  const [authors, setAuthors] = useState([]);
  const result = useQuery(ALL_PERSONS);
  console.log(result);

    useState(() => {
      setAuthors(result.data.allAuthors);
    }, []);
  
    if (!props.show) {
      return null
    }
    return (
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.length !== 0 && authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
  
  export default Authors;