import axios from "axios";

const API = process.env.REACT_APP_API_BASE || "http://localhost:4000";

export async function fetchProducts() {
  const res = await axios.get(`${API}/api/products`);
  return res.data;
}

export async function fetchCart() {
  const res = await axios.get(`${API}/api/cart`);
  return {
    items: res.data.items || [],
    total: res.data.total || 0,
  };
}

export async function addToCartApi(payload) {
  return axios.post(`${API}/api/cart`, payload);
}


export async function deleteCartItemApi(id) {
  return axios.delete(`${API}/api/cart/${id}`);
}

export async function updateCartQty({ cartItemId, qty }) {
  const res = await axios.put(`${API}/api/cart/${cartItemId}`, { qty });
  return res.data;
}


export async function checkoutApi(payload) {
  const res = await axios.post(`${API}/api/checkout`, payload);
  return res.data;
}
