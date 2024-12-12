import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = ({ addToCart }) => {
  const [data, setData] = useState([]);
  const [role, setRole] = useState('');
  const token = localStorage.getItem('token');

  const deleteProduct = async (product) => {
    await fetch(`http://localhost:5000/api/products/${product.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    window.location.reload();
  }


  useEffect(() => {
    setRole(localStorage.getItem('role'))
    const url = 'http://localhost:5000/api/products';
    async function products() {
      try {

        const response = await fetch(url);
        const result = await response.json();
        console.log(result)
        setData(result);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
    products();
  }, [])
  console.log(data)
  return (
    <div className="product-list">
      {data.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Precio: ${product.price}</p>
          {role !== 'ADMIN' ?
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
            : <div>
              <Link to={`/edit/${product.id}`}><button>Editar</button></Link>
              <button onClick={() => deleteProduct(product)}  >Eliminar</button>
            </div>
          }


        </div>
      ))}
    </div>
  );
};


export default ProductList;
