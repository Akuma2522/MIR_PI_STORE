import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { ValidateRole } from "../services/ValidateRole";
import { Link } from "react-router-dom";
import { getProducts, deleteProduct } from "../services/product";

const ProductList = ({ addToCart }) => {
  const [data, setData] = useState([]);
  const [role, setRole] = useState('');


  const deleteProductData = async (product) => {
    const token = localStorage.getItem('token');
    try {
      deleteProduct(product.id, token);
      console.log(`Deleted product with ID: ${product.id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting product:', error);
    }

  }

  const getProductData = async () => {
    try {
      const products = await getProducts();
      setData(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  useEffect(() => {
    setRole(ValidateRole());
    getProductData();
  }, [])
  return (
    <div className="product-list">
      {data.map((product) => (
        <div key={product.id} className="product-card">
          <img src={product.image} alt={product.name} />
          <h3>{product.name}</h3>
          <p>Descripción: {product.description}</p>
          <p>Precio: ${product.price}</p>
          {role !== 'ADMIN' ?
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
            : <div>
              <Link to={`/edit/${product.id}`}><button>Editar</button></Link>
              <button onClick={() => deleteProductData(product)}  >Eliminar</button>
            </div>
          }
        </div>
      ))}
    </div>
  );
};
ProductList.propTypes = {
  addToCart: PropTypes.func.isRequired
}


export default ProductList;
