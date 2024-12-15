import { useState } from "react";
import PropTypes from "prop-types";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { payment } from "../services/payment";
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
    const dataCart = JSON.stringify({ cart });
    const res = await payment(dataCart);

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
    <form onSubmit={handleSubmit} style={{ maxWidth: "1000px", width: "50%", margin: "0 auto", border: "1px solid #ccc", padding: "20px", borderRadius: "5px", boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}>
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

      <button onClick={() => { window.location.reload() }}>Regresar al Inicio</button>
    </form>
  );
};
CheckoutForm.propTypes = {
  cart: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
};

export default CheckoutForm;
