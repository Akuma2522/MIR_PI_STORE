import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
const BASE_URL = "http://localhost:5000"
const ProductUpdate = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const token = localStorage.getItem('token');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('role') === 'USER') {
      navigate('/')
    };
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/products/${id}`);
        if (response.ok) {
          const product = await response.json();
          setProductName(product.name);
          setProductDescription(product.description);
          setProductPrice(product.price);
          setProductCategory(product.category);
          setProductImage(product.image);
        } else {
          alert('Failed to fetch product data.');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        alert('An error occurred while fetching the product.');
      }
    };

    if (localStorage.getItem('role') === 'USER') {
      navigate('/');
    } else {
      fetchProduct();
    }
  }, [id, navigate]);

  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formImage = new FormData();
    formImage.append('image', productImage);
    const product = {
      name: productName,
      description: productDescription,
      price: productPrice,
      category: productCategory
    };

    try {
      if (productImage && typeof productImage !== 'string') {
        const responseImage = await fetch(`${BASE_URL}/api/products/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formImage,
        });
        const data = await responseImage.json();
        product.image = data.secure_url;
      } else {
        product.image = productImage;
      }

      const response = await fetch(`${BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        navigate('/');
      } else {
        alert('Failed to update product.');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('An error occurred while updating the product.');
    }
  };

  return (
    <div className="product-update">
      <form onSubmit={handleSubmit}>
        <h2>Update Product</h2>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={productCategory}
            onChange={(e) => setProductCategory(e.target.value)}
          />
        </div>
        <div>
          <label>Product Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default ProductUpdate;
