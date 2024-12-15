import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL;
export const registerUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/api/users/register`, userData);
  return response;
}

export const loginUser = async (userData) => {
  const response = await axios.post(`${BASE_URL}/api/users/login`, userData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response;
}
export const validateUser = async (token) => {
  const response = await fetch(`${BASE_URL}/api/auth/validate-token`,
    {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }

  );
  return response;
}
