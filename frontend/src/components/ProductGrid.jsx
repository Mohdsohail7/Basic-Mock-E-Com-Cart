import React from "react";

export default function ProductGrid({ products, onAdd }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="
              bg-white p-4 rounded-lg shadow-sm flex flex-col
              transform transition-transform duration-300
              hover:shadow-lg hover:-translate-y-1 hover:scale-105
            "
          >
            {/* Product Image */}
            <div className="h-40 w-full bg-gray-100 rounded flex items-center justify-center mb-3 overflow-hidden">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            {/* Product Info */}
            <h3 className="font-medium">{p.name}</h3>
            <p className="text-sm text-gray-500">{p.description}</p>

            {/* Price & Add Button */}
            <div className="mt-auto flex items-center justify-between pt-4">
              <div className="text-lg font-semibold">${p.price}</div>
              <button
                onClick={() => onAdd(p.id)}
                className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
