import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

const SecretPage = () => {
  const token = Cookies.get("access_token");
  const [isValidToken, setIsValidToken] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const decodedToken = jwt.decode(token);
    if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
      setIsValidToken(true);
    } else {
      setIsValidToken(false);
    }
  }, [token]);

  const handleLogout = () => {
    Cookies.remove("access_token");
    navigate("/");
  };

  if (!isValidToken) {
    return (
      <div className="container text-center mt-5">
        <h1>Acceso denegado</h1>
        <p>
          No tienes permiso para acceder a esta página. Por favor, inicia sesión
          primero.
        </p>
        <button className="btn btn-danger" onClick={handleLogout}>
        Go Home
      </button>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h1>Enhorabuena, Ruta protegida</h1>
      <p>
        Esta es una ruta protegida que solo puede ser accedida con un token JWT
        válido.
      </p>
      <button className="btn btn-primary" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
};

export default SecretPage;
