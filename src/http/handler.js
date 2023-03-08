import Cookies from "js-cookie";

export function HttpHandler() {
  const urlLogin = process.env.BACKEND_URL + "/login";
  const urlRegister = process.env.BACKEND_URL + "/register";

  function getToken() {
    const access_token = Cookies.get("access_token");
    if (access_token) {
      return `Bearer ${access_token}`;
    } else {
      return "";
    }
  }

  const contentType = {
    "Content-Type": "application/json",
  };

  async function register(email, password) {
    try {
      // console.log('Enviando datos al backend:', email, password);
      const response = await fetch(urlRegister, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: contentType,
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        // Agregar el token de acceso a la cookie del cliente
        Cookies.set("access_token", data.access_token,);
      }

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async function login(email, password) {
    try {
      // console.log('Enviando datos al backend:', email, password);
      const response = await fetch(urlLogin, {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: contentType,
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);

      if (response.ok) {
        // Agregar el token de acceso a la cookie del cliente
        Cookies.set("access_token", data.access_token,);
      }

      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  return {
    login,
    register,
  };
}
