import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { HttpHandler } from "../../../http/handler";

import "../../styles/home.css";

const handler = new HttpHandler();

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log(email, password);
    const response = await handler.login(email, password);
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
      <h1> LOGIN </h1>
      <form onSubmit={handleLogin}>
        <p>
          <label className="form-label"> Email: </label>
          <input
            className="form-control"
            type="email"
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </p>
        <p>
          <label className="form-label"> Password: </label>
          <input
            className="form-control"
            type="password"
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </p>
        <button
          className="btn btn-outline-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Login"}
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

export default Login;

// import React from 'react';
// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../../styles/home.css';

// const Login = () => {
//     const navigate = useNavigate();
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const signup = async (event) => {
//       event.preventDefault(); // evita que la página se recargue al enviar el formulario
//       console.log(email, password);
//       const myHeaders = new Headers();
//       myHeaders.append('Content-Type', 'application/json');

//       const raw = JSON.stringify({
//         email,
//         password,
//       });

//       const requestOptions = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow',
//       };

//       try {
//         const response = await fetch(`${process.env.BACKEND_URL}/signup`, requestOptions);
//         const result = await response.json();

//         if (result.email) {
//           navigate('/secret');
//         } else {
//           setError('El usuario ya existe');
//         }
//       } catch (error) {
//         console.log('error', error);
//       }
//     };

//   return (
//     <div className="container text-center mt-5">
//       <h1> LOGIN </h1>
//       <form onSubmit={signup}>
//         <p>
//           <label className="form-label"> Email: </label>
//           <input className="form-control" type="email" onChange={(event) => setEmail(event.target.value)} required />
//         </p>
//         <p>
//           <label className="form-label"> Password: </label>
//           <input className="form-control" type="password" onChange={(event) => setPassword(event.target.value)} required />
//         </p>
//         <button className="btn btn-outline-primary" type="submit">
//           Login
//         </button>
//       </form>
//       {error && (
//         <div className="alert alert-danger" role="alert">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;
