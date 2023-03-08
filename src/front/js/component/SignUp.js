import React, { useState } from 'react';

import '../../styles/home.css';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signup = async (event) => {
    event.preventDefault(); // evita que la página se recargue al enviar el formulario
    console.log(email, password);
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      email,
      password,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    try {
      const response = await fetch('https://3001-4geeksacade-reactflaskh-ea2apv1hwm8.ws-eu79.gitpod.io/api/signup', requestOptions);
      const result = await response.json();

      if (result.email) {
        navigate('/');
      } else {
        setError('El usuario ya existe');
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1> SIGNUP </h1>
      <form onSubmit={signup}>
        <p>
          <label className="form-label"> Email: </label>
          <input className="form-control" type="email" onChange={(event) => setEmail(event.target.value)} required />
        </p>
        <p>
          <label className="form-label"> Password: </label>
          <input className="form-control" type="password" onChange={(event) => setPassword(event.target.value)} minLength={8} required />
        </p>
        <button className="btn btn-outline-primary" type="submit">
          Signup
        </button>
      </form>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Signup;