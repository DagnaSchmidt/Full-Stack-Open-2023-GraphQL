import { useQuery } from "@apollo/client";

import { ALL_AUTHORS } from "../queries";
import SetBirthYear from "./SetBirthYear";


const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS);
  console.log(result.data);

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
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {result.data && result.data.allAuthors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <SetBirthYear />
      </div>
    )
  }
  
  export default Authors;