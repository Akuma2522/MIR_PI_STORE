import { createContext, useState, useEffect } from "react";
import { loginUser, validateUser } from "../services/user";
import PropTypes from "prop-types";
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validar el token al cargar la aplicación
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          console.log(token);
          const response = await validateUser(token);
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
          } else {
            localStorage.removeItem("token");
            setUser(null);
          }
        } catch (error) {
          console.error("Error validating token:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    validateToken();
  }, []);

  const login = async (credentials) => {
    try {
      const dataLogin = JSON.stringify(credentials)
      const response = await loginUser(dataLogin)
      if (response.status === 200) {
        const data = await response.data;
        console.log(data.token);
        localStorage.setItem("token", data.token);
        setUser(data.user);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


export default AuthProvider;
