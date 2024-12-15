import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ValidateRole } from '../services/ValidateRole';
import { createProduct, uploadImage } from '../services/product';
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
    if (ValidateRole() !== 'ADMIN') {
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
      const responseImage = await uploadImage(formImage, token);
      product.image = responseImage.secure_url;
      const dataProduct = JSON.stringify(product);
      const response = await createProduct(dataProduct, token);
      if (response.status === 201) {
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
