import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
const BASE_URL = "http://localhost:5000"
const CheckoutForm = ({ cart, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Llama al backend para crear un PaymentIntent
    const res = await fetch(`${BASE_URL}/api/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cart }),
    });

    const { clientSecret } = await res.json();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const paymentResult = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (paymentResult.error) {
      setError(paymentResult.error.message);
      setLoading(false);
    } else if (paymentResult.paymentIntent.status === "succeeded") {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Finalizar Compra</h2>
      <ul>
        {cart.map((item, index) => (
          <li key={index}>
            {item.name} - {item.quantity} x ${(item.price).toFixed(2)}
          </li>
        ))}
      </ul>
      <h3>Total: ${total.toFixed(2)}</h3>
      <CardElement />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>¡Pago exitoso!</p>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? "Procesando..." : "Pagar"}
      </button>
    </form>
  );
};

export default CheckoutForm;
