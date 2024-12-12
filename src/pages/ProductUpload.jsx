import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const BASE_URL = import.meta.env.VITE_API_URL
const ProductUpload = () => {
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const token = localStorage.getItem('token');
  const handleFileChange = (e) => {
    setProductImage(e.target.files[0]);
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem('role') === 'USER') {
      navigate('/')
    };
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formImage = new FormData();
    formImage.append('image', productImage);
    const product = {
      name: productName,
      description: productDescription,
      price: productPrice,
      category: productCategory
    }

    try {
      const responseImage = await fetch(`${BASE_URL}/api/products/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formImage,

      });
      const data = await responseImage.json();

      product.image = data.secure_url;
      console.log(product)
      const response = await fetch(`${BASE_URL}/api/products/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });
      if (response.ok) {
        alert('Product uploaded successfully!');
        setProductName('');
        setProductDescription('');
        setProductPrice('');
        setProductCategory('');
        setProductImage(null);
        navigate('/')
      } else {
        alert('Failed to upload product.');
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('An error occurred while uploading the product.');
    }
  };

  return (
    <div className="product-upload">
      <form onSubmit={handleSubmit}>
        <h2>Upload Product</h2>
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
          <input type="file" accept="image/*" name="image" onChange={handleFileChange} />
        </div>
        <button type="submit">Upload Product</button>
      </form>
    </div>



  );
};

export default ProductUpload;
