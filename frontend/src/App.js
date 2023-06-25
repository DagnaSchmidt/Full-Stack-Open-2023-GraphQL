import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notification from './components/Notification';
import Login from './components/Login';
import { useApolloClient, useSubscription } from '@apollo/client';
import Recommendations from './components/Recommendations';
import { ALL_BOOKS, BOOK_ADDED } from './queries';

export const updateCache = (cache, query, addedPerson) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k)
    });
  }

  cache.updateQuery(query, ({allBooks}) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedPerson))
    }
  })
};

const App = () => {
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      console.log(data);
      const addedBook = data.data.bookAdded;
      showError(`${addedBook.title} added`);
      // window.alert(`${addedBook.title} added`);

      updateCache(client.cache, {query: ALL_BOOKS}, addedBook);
    }
  });

  const showError = (content) => {
    setErrorMessage(content);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
  };

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  }

  if(token === null){
    return (
    <>
      <Notification errorMessage={errorMessage} />
      <Login setToken={setToken} showError={showError} />
    </>
    )
  }
  return (
    <div>
      <Notification errorMessage={errorMessage} />
      <button onClick={logout}>logout</button>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommendations')}>recommendations</button>
      </div>

      <Authors show={page === 'authors'} showError={showError}/>

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} showError={showError} />

      <Recommendations show={page === 'recommendations'} />
    </div>
  )
}

export default App;