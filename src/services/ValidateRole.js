import { jwtDecode } from "jwt-decode";

export function ValidateRole() {
  const token = localStorage.getItem('token');
  if (token) {
    return jwtDecode(token).role;
  }
  return null;
}


