import React from "react";
import PropTypes from "prop-types";

const Cart = ({ cart, removeFromCart, removeAllOfType, clearCart, cartVisibility }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart" style={{ visibility: cartVisibility }}>
      <h2>Carrito</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} - ${item.price} x {item.quantity}
                <button onClick={() => removeFromCart(item.id)}>Quitar uno</button>
                <button onClick={() => removeAllOfType(item.id)}>Eliminar todos</button>
              </li>
            ))}
          </ul>
          <hr />
          <h3>Total a pagar: ${total.toFixed(2)}</h3>
          <button onClick={clearCart} style={{ marginTop: "10px", backgroundColor: "#f44336", color: "white", padding: "10px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Vaciar carrito
          </button>

        </>
      )}
    </div>
  );
};
Cart.propTypes = {//+
  cart: PropTypes.arrayOf(PropTypes.shape({//+
    id: PropTypes.number.isRequired,//+
    name: PropTypes.string.isRequired,//+
    price: PropTypes.number.isRequired,//+
    quantity: PropTypes.number.isRequired,//+
  })).isRequired,//+
  removeFromCart: PropTypes.func.isRequired,//+
  removeAllOfType: PropTypes.func.isRequired,//+
  clearCart: PropTypes.func.isRequired,//+
  cartVisibility: PropTypes.string.isRequired,//+
};


export default Cart;
