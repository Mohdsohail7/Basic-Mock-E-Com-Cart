import React from "react";

export default function ProductGrid({ products, onAdd }) {
  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500 py-8">No products available</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="
              bg-white rounded-lg shadow-sm flex flex-col
              transform transition-transform duration-300
              hover:shadow-lg hover:-translate-y-1 hover:scale-105
            "
          >
            {/* Product Image */}
            <div className="w-full aspect-square bg-gray-100 rounded-t-lg overflow-hidden flex items-center justify-center mb-3">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400">No Image</span>
              )}
            </div>

            {/* Product Info */}
            <div className="px-4 pb-4 flex flex-col flex-grow">
              <h3 className="font-medium">{p.name}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">
                {p.description || "No description available."}
              </p>

              {/* Price & Add Button */}
              <div className="mt-auto flex items-center justify-between pt-3">
                <div className="text-lg font-semibold">${p.price}</div>
                <button
                  onClick={() => onAdd(p.id)}
                  className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
