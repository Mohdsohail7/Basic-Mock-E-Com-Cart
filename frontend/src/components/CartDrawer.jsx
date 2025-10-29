import React from "react";

export default function CartDrawer({ open, onClose, cart, onRemove, onUpdateQty, onCheckout }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex">
      <div className="w-full md:w-96 bg-white shadow-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Your Cart ({cart.items.length})</h3>
          <button onClick={onClose} className="text-gray-500">
            Close
          </button>
        </div>

        <div className="space-y-3">
          {cart.items.length === 0 && (
            <div className="text-sm text-gray-500">Cart is empty</div>
          )}
          {cart.items.map((item) => (
            <div
              key={item.cartItemId}
              className="flex items-center justify-between bg-gray-50 p-2 rounded"
            >
              <div className="flex flex-col">
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-gray-500 flex items-center gap-2">
                  <button
                    onClick={() => onUpdateQty(item.cartItemId, item.qty - 1)}
                    disabled={item.qty <= 1}
                    className="px-2 py-0.5 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  Qty: {item.qty}
                  <button
                    onClick={() => onUpdateQty(item.cartItemId, item.qty + 1)}
                    className="px-2 py-0.5 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <div>${item.lineTotal}</div>
                <button
                  onClick={() => onRemove(item.cartItemId)}
                  className="text-sm text-red-500 mt-1"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between font-semibold">
            <span>Total</span> <span>${cart.total}</span>
          </div>
          <div className="mt-4">
            <button
              onClick={onCheckout}
              className="w-full px-3 py-2 rounded bg-green-600 text-white"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1" onClick={onClose}></div>
    </div>
  );
}
