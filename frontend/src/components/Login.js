import { useMutation } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { LOGIN } from '../queries';

const Login = ({setToken, showError}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => {
            showError(error.graphQLErrors[0].message);
        }
    });

    useEffect(() => {
        if(result.data){
            const token = result.data.login.value;
            setToken(token);
            localStorage.setItem('book-user-token', token);
        }
    }, [result.data]) // eslint-disable-line

    const handleSubmit = (e) => {
        e.preventDefault();

        login({variables: {username, password}});
    }

  return (
    <div>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            username
            <input
                value={username}
                onChange={({target}) => setUsername(target.value)}
            />
            password
            <input
                value={password}
                onChange={({target}) => setPassword(target.value)}
            />
            <button>login</button>
        </form>
    </div>
  )
}

export default Login;