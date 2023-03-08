import React, { useState } from 'react';
import Login from '../component/Login.js';
import Signup from '../component/SignUp.js';

const ButtonGroup = ({ showLogin, handleShowLogin, handleShowSignup }) => {
  return (
    <div className="btn-group">
      <button className={`btn ${showLogin ? 'btn-primary' : 'btn-secondary'}`} onClick={handleShowLogin}>Login</button>
      <button className={`btn ${!showLogin ? 'btn-primary' : 'btn-secondary'}`} onClick={handleShowSignup}>SignUp</button>
    </div>
  );
};

export const Home = () => {
  const [showLogin, setShowLogin] = useState(true);

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const handleShowSignup = () => {
    setShowLogin(false);
  };

  return (
    <div className="container">
      <h1>Welcome to my App</h1>
      <ButtonGroup
        showLogin={showLogin}
        handleShowLogin={handleShowLogin}
        handleShowSignup={handleShowSignup}
      />
      {showLogin ? <Login /> : <Signup />}
    </div>
  );
};