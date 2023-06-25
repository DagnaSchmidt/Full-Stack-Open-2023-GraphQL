import { useMutation } from '@apollo/client';
import { useState } from 'react';
import { ADD_BOOK, ALL_BOOKS, ALL_AUTHORS } from '../queries';

const NewBook = (props) => {
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [published, setPublished] = useState('');
  const [genre, setGenre] = useState('')
  const [genres, setGenres] = useState([])

  const [createBook] = useMutation(ADD_BOOK, {
    refetchQueries: [{query: ALL_AUTHORS}, {query: ALL_BOOKS}],
    onError: (error) => {
      const errors = error.graphQLErrors[0].extensions.error.errors;
      const messages = Object.values(errors).map(e => e.message).join('\n');
      props.showError(messages);
    }
  });

  const submit = async (event) => {
    event.preventDefault();
    createBook({ variables: { title, authorName, published: Number(published), genres}});
    setTitle('');
    setPublished('');
    setAuthorName('');
    setGenres([]);
    setGenre('');
  }

  const addGenre = () => {
    setGenres(genres.concat(genre))
    setGenre('')
  }


  if (!props.show) {
    return null
  }
  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={authorName}
            onChange={({ target }) => setAuthorName(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(' ')}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  )
}

export default NewBook;