
// Import the base URL from Vite environment variables
const BASE_URL = import.meta.env.VITE_API_URL;
export const payment = async (cart) => {
  const response = await fetch(`${BASE_URL}/api/create-payment-intent`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: cart,
  })
  return response;
};
