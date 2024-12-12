import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
const BASE_URL = "http://localhost:5000"
// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validar el token al cargar la aplicación
  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      console.log("Token: " + token);
      if (token) {
        try {
          const response = await fetch(`${BASE_URL}/api/auth/validate-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

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
      const response = await fetch(`${BASE_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;
        if (token) {
          const decodedToken = jwtDecode(token);
          localStorage.setItem("role", decodedToken.role); // Extract the role
        }

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

export default AuthProvider;
