import React, { useEffect, useState } from "react";
import {
  fetchProducts,
  fetchCart,
  addToCartApi,
  deleteCartItemApi,
  checkoutApi,
} from "./utils/api";
import ProductGrid from "./components/ProductGrid";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";
import { updateCartQty } from "./utils/api";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receipt, setReceipt] = useState(null);

  async function loadProducts() {
    const res = await fetchProducts();
    setProducts(res || []);
  }

  async function loadCart() {
    const res = await fetchCart();
    setCart(res || { items: [], total: 0 });
  }

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  async function addToCart(productId) {
    await addToCartApi({ productId, qty: 1 });
    await loadCart();
    setCartOpen(true);
  }

  async function updateCartQuantity(cartItemId, qty) {
  if (qty < 1) return; 
  await updateCartQty({ cartItemId, qty });
  await loadCart();
}


  async function removeFromCart(cartItemId) {
    await deleteCartItemApi(cartItemId);
    await loadCart();
  }

  async function onCheckout(data) {
    const res = await checkoutApi({ name: data.name, email: data.email });
    setReceipt(res.receipt);
    setCheckoutOpen(false);
    setCartOpen(false);
    await loadCart();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Vibe Commerce — Mock Store</h1>
          <button
            onClick={() => setCartOpen(true)}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white"
          >
            Cart ({cart.items.length})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <ProductGrid products={products} onAdd={addToCart} />
      </main>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateCartQuantity}
        onCheckout={() => setCheckoutOpen(true)}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onSubmit={onCheckout}
      />

      {receipt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-2">Receipt</h3>
            <p>ID: {receipt.id}</p>
            <p>Name: {receipt.name || "Guest"}</p>
            <p>Email: {receipt.email}</p>
            <p>Total: ${receipt.total}</p>
            <p className="text-sm text-gray-500">{new Date(receipt.timestamp).toLocaleString()}</p>
            <p className="mt-2 text-gray-700">{receipt.note}</p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setReceipt(null)}
                className="px-3 py-1 rounded bg-indigo-600 text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="mt-16 py-8 text-center text-sm text-gray-500">
        Mock E-Com · No real payments · Built with React + Tailwind
      </footer>
    </div>
  );
}
