import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ValidateRole } from '../services/ValidateRole';
import { updateProduct, uploadImage, getProductById } from '../services/product';
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
    if (ValidateRole() !== 'ADMIN') {
      navigate('/')
    };
    const fetchProduct = async () => {
      try {
        const response = await getProductById(id);
        if (response.status === 200) {
          const product = await response.data;
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

    if (ValidateRole() !== 'ADMIN') {
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
      price: parseFloat(productPrice),
      category: productCategory
    };

    try {
      const responseImage = await uploadImage(formImage, token);
      product.image = responseImage.secure_url;
      const dataProduct = JSON.stringify(product);
      const response = await updateProduct(id, dataProduct, token);
      if (response.status === 200) {
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
