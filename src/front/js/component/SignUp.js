import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { HttpHandler } from '../../../http/handler';

import '../../styles/home.css';

const handler = new HttpHandler();

const Signup = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(email, password);
    const response = await handler.register(email, password);
    console.log(response);

    if (response.access_token) {
      Cookies.set('access_token', response.access_token);
      navigate('/secret');
    } else {
      setErrorMessage('Email o contraseña incorrectos');
    }
  };

  return (
    <div className="container text-center mt-5">
      <h1> SIGNUP </h1>
      <form onSubmit={handleLogin}>
        <p>
          <label className="form-label"> Email: </label>
          <input className="form-control" type="email" onChange={(event) => setEmail(event.target.value)} required />
        </p>
        <p>
          <label className="form-label"> Password: </label>
          <input className="form-control" type="password" onChange={(event) => setPassword(event.target.value)} required />
        </p>
        <button className="btn btn-outline-primary" type="submit" >Signup
        </button>
      </form>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default Signup;