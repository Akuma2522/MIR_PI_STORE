import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ProductList from '../components/ProductList';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import { Link } from 'react-router-dom';

// Carga tu clave pública de Stripe
const stripePromise = loadStripe("pk_test_51QUdnCRwyVq7Qw6eyraXxGwzNMGZN4KbGPEO09PIsEt2Rs4hvx9pJOLnFK61btZg3wn5eBOLz9NOfRMFaoTR9Tr900IVHIvhjP");

function Home() {
  const [cart, setCart] = useState([]);
  const [cartVisibility, setCartVisibility] = useState('hidden');
  const [contadorClick, setContadorClick] = useState(1)
  const [role, setRole] = useState('');
  const [checkout, setCheckout] = useState(false); // Estado para mostrar el formulario de pago


  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);






  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeAllOfType = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  return (
    <>
      <header>
        <h1>Mi Tienda Virtual</h1>
        {!role ?
          <Link to={"/login"}>
            <button>Iniciar Sesión</button>
          </Link>
          : <button onClick={() => { localStorage.clear(); window.location.href = "/" }}>Cerrar Sesión</button>
        }
        {role == "ADMIN" ? <Link to={"/upload"}><button>Subir Producto</button></Link> : <div className="header-cart" onClick={() => { setContadorClick(contadorClick + 1); if (contadorClick % 2 === 0) { setCartVisibility('hidden') } else setCartVisibility('visible') }}>
          🛒 {cart.reduce((total, item) => total + item.quantity, 0)} artículos
        </div>}



      </header>
      <div className="container">
        {!checkout ? (
          <>
            <ProductList addToCart={addToCart} />
            <Cart
              cart={cart}
              cartVisibility={cartVisibility}
              removeFromCart={removeFromCart}
              removeAllOfType={removeAllOfType}
              clearCart={clearCart}
            />
            {role !== 'ADMIN' ? <button
              onClick={() => setCheckout(true)}
              disabled={cart.length === 0}
              className="checkout-button"
            >
              Ir a Pagar (${(calculateTotal()).toFixed(2)})
            </button> : null}

          </>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm cart={cart} total={calculateTotal()} />
          </Elements>
        )}
      </div>
    </>
  );
}

export default Home;
