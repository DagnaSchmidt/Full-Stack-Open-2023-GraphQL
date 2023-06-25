import { useState } from 'react';
import Authors from './components/Authors';
import Books from './components/Books';
import NewBook from './components/NewBook';
import Notification from './components/Notification';
import Login from './components/Login';
import { useApolloClient } from '@apollo/client';
import Recommendations from './components/Recommendations';

const App = () => {
  const [page, setPage] = useState('authors');
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const client = useApolloClient();

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