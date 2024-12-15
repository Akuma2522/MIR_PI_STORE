import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_URL
export const getProducts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products/${id}`);
    return response;

  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const deleteProduct = async (id, token) => {
  try {
    console.log(id);
    await axios.delete(`${BASE_URL}/api/products/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};

export const updateProduct = async (id, product, token) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/products/${id}`, product
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating product:", error);
  }
};


export const uploadImage = async (image, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/products/upload`, image, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const createProduct = async (product, token) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/products/`, product
      , {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating product:", error);
    return null;
  }
};
