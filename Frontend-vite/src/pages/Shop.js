import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId) => {
    try {
      console.log("Adding to cart - Product ID:", productId);
      const response = await axios.get(`/addtocart/${productId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Add to cart response:", response.data);
      if (response.data && response.data.success) {
        showNotification("Product added to cart!", "success");
      } else {
        showNotification(
          response.data?.error || "Error adding to cart",
          "error"
        );
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      console.error("Error response:", error.response);
      if (error.response?.status === 401) {
        window.location.href = "/";
      } else {
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Error adding to cart";
        showNotification(errorMessage, "error");
      }
    }
  };

  const showNotification = (message, type) => {
    if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError(message);
      setTimeout(() => setError(""), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <Header pageLabel="Product Shop" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header pageLabel="Product Shop" />

      {success && (
        <div className="fixed top-5 right-5 p-3 rounded-md bg-green-500 text-white z-50">
          {success}
        </div>
      )}

      {error && (
        <div className="fixed top-5 right-5 p-3 rounded-md bg-red-500 text-white z-50">
          {error}
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Page Content */}
        <div className="flex px-8 py-8 gap-8">
          {/* Sidebar */}
          <div className="w-72 bg-white rounded-lg shadow-md p-6 h-fit sticky top-24 border border-gray-200">
            {/* Sort Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-sort-desc text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Sort By</h3>
              </div>
              <form className="space-y-3">
                <select className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:border-gray-500 focus:outline-none transition-colors text-gray-700">
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <button
                  type="submit"
                  className="w-full px-3 py-2 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Apply Sort
                </button>
              </form>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                  <i className="ri-grid-line text-white"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Categories
                </h3>
              </div>
              <div className="space-y-2">
                <a
                  className="block px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 hover:text-gray-900"
                  href="/shop"
                >
                  All Products
                </a>
                <a
                  className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-300 font-medium border border-transparent hover:border-indigo-200"
                  href="/shop?category=new"
                >
                  New Collection
                </a>
                <a
                  className="block px-4 py-3 rounded-xl hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 transition-all duration-300 font-medium border border-transparent hover:border-indigo-200"
                  href="/shop?discount=true"
                >
                  Discounted Products
                </a>
              </div>
            </div>

            {/* Filters */}
            <div>
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <i className="ri-filter-line text-white text-lg"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Filters</h3>
              </div>
              <div className="space-y-4">
                <label className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 font-medium">In Stock</span>
                </label>
                <label className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 font-medium">On Sale</span>
                </label>
                <label className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-3 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Free Shipping
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Enhanced Products Grid */}
          <div className="flex-1">
            <div className="mb-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
              <div className="flex items-center justify-between">
                <p className="text-gray-700 text-lg font-medium">
                  Showing
                  <span className="font-bold text-indigo-600">
                    {" "}
                    {products.length}
                  </span>{" "}
                  products
                </p>
                <div className="flex items-center text-gray-600">
                  <i className="ri-store-2-line mr-2"></i>
                  <span className="text-sm">Premium Collection</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="group rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-3xl border border-gray-100"
                  style={{ background: product.panelcolor || "#ffffff" }}
                >
                  {/* Product Image */}
                  <div
                    className="relative h-64 flex items-center justify-center overflow-hidden"
                    style={{ background: product.bgcolor || "#f3f4f6" }}
                  >
                    <img
                      className="h-48 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                      src={product.image || "/images/image 80.png"}
                      alt={product.name || "Product"}
                      onError={(e) => {
                        console.log(
                          "Image load error for product:",
                          product._id,
                          "Image:",
                          product.image
                        );
                        e.target.src = "/images/image 80.png";
                      }}
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                        -₹{product.discount}
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
                  </div>

                  {/* Product Details */}
                  <div
                    className="p-6"
                    style={{ color: product.textcolor || "#374151" }}
                  >
                    <h3 className="font-bold text-xl mb-3 truncate group-hover:text-indigo-600 transition-colors duration-300">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold">
                          ₹{product.price}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm line-through text-gray-400 ml-2">
                            ₹{product.price + product.discount}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-yellow-500">
                        <i className="ri-star-fill text-sm"></i>
                        <span className="text-sm ml-1 text-gray-600">4.8</span>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                      onClick={() => addToCart(product._id)}
                      className="w-full py-3 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg group-hover:shadow-xl"
                    >
                      <i className="ri-shopping-cart-plus-line text-lg"></i>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-20 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg">
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ri-shopping-bag-line text-4xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-3">
                  No products found
                </h3>
                <p className="text-gray-500 text-lg">
                  Try adjusting your filters or check back later
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
