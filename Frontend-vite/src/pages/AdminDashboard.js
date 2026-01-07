import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [revenue, setRevenue] = useState(0);

  // Form state for creating new product
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    discount: "0",
    bgcolor: "#f3f4f6",
    textcolor: "#374151",
    panelcolor: "#ffffff",
    image: null,
  });

  // Form state for editing product
  const [editProduct, setEditProduct] = useState({
    name: "",
    price: "",
    discount: "0",
    bgcolor: "#f3f4f6",
    textcolor: "#374151",
    panelcolor: "#ffffff",
    image: null,
  });

  useEffect(() => {
    fetchProducts();
    fetchRevenue();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/admin/products");
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await axios.get("/api/payments/owner-revenue", {
        headers: {
          Accept: "application/json",
        },
      });
      if (response.data.success) {
        setRevenue(response.data.totalRupees || 0);
      }
    } catch (error) {
      console.error("Error fetching revenue:", error);
      // Don't show error for revenue fetch as it's not critical
      setRevenue(0);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (newProduct[key] !== null) {
        formData.append(key, newProduct[key]);
      }
    });

    try {
      const response = await axios.post("/products/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      if (response.data && response.data.success) {
        setSuccess("Product created successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setNewProduct({
          name: "",
          price: "",
          discount: "0",
          bgcolor: "#f3f4f6",
          textcolor: "#374151",
          panelcolor: "#ffffff",
          image: null,
        });
        setShowCreateForm(false);
        fetchProducts(); // Refresh products list
        fetchRevenue(); // Refresh revenue
      } else {
        const errorMessage = response.data?.error || "Failed to create product";
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create product";
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData();
    Object.keys(editProduct).forEach((key) => {
      if (editProduct[key] !== null && editProduct[key] !== "") {
        formData.append(key, editProduct[key]);
      }
    });

    try {
      const response = await axios.put(
        `/products/edit/${editingProduct._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      if (response.data && response.data.success) {
        setSuccess("Product updated successfully!");
        setTimeout(() => setSuccess(""), 3000);
        setEditingProduct(null);
        setEditProduct({
          name: "",
          price: "",
          discount: "0",
          bgcolor: "#f3f4f6",
          textcolor: "#374151",
          panelcolor: "#ffffff",
          image: null,
        });
        fetchProducts(); // Refresh products list
        fetchRevenue(); // Refresh revenue
      } else {
        const errorMessage = response.data?.error || "Failed to update product";
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Update product error:", error);
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to update product";
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  const startEditProduct = (product) => {
    setEditingProduct(product);
    setEditProduct({
      name: product.name,
      price: product.price.toString(),
      discount: product.discount.toString(),
      bgcolor: product.bgcolor || "#f3f4f6",
      textcolor: product.textcolor || "#374151",
      panelcolor: product.panelcolor || "#ffffff",
      image: null, // Don't set existing image, only new uploads
    });
    setShowCreateForm(false);
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setEditProduct({
      name: "",
      price: "",
      discount: "0",
      bgcolor: "#f3f4f6",
      textcolor: "#374151",
      panelcolor: "#ffffff",
      image: null,
    });
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        console.log("Deleting product:", productId);
        const response = await axios.delete(`/products/delete/${productId}`, {
          headers: {
            Accept: "application/json",
          },
        });
        console.log("Delete response:", response.data);
        if (response.data && response.data.success) {
          setSuccess("Product deleted successfully!");
          setTimeout(() => setSuccess(""), 3000);
          fetchProducts(); // Refresh products list
          fetchRevenue(); // Refresh revenue
        } else {
          const errorMessage =
            response.data?.error || "Failed to delete product";
          setError(errorMessage);
          setTimeout(() => setError(""), 5000);
        }
      } catch (error) {
        console.error("Delete product error:", error);
        console.error("Error response:", error.response);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to delete product";
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
    setEditingProduct(null);
    setError("");
    setSuccess("");
  };

  const showNotification = (message, type) => {
    if (type === "success") {
      setSuccess(message);
      setTimeout(() => setSuccess(""), 5000);
    } else {
      setError(message);
      setTimeout(() => setError(""), 5000);
    }
  };

  // Use revenue from actual payments instead of product prices
  const totalRevenue = revenue;

  if (loading && products.length === 0) {
    return (
      <>
        <Header pageLabel="Admin Dashboard" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header pageLabel="Admin Dashboard" />

      {success && (
        <div className="fixed top-5 right-5 left-5 sm:left-auto p-3 sm:p-4 rounded-lg bg-green-500 text-white z-50 text-sm sm:text-base text-center sm:text-left max-w-md">
          {success}
        </div>
      )}

      {error && (
        <div className="fixed top-5 right-5 left-5 sm:left-auto p-3 sm:p-4 rounded-lg bg-red-500 text-white z-50 text-sm sm:text-base text-center sm:text-left max-w-md">
          {error}
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="p-4 sm:p-6 lg:p-8">
          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-7">
            <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 group hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl shadow-lg">
                  <i className="ri-product-hunt-line text-2xl sm:text-3xl text-white"></i>
                </div>
                <div className="ml-4 sm:ml-6">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide">
                    Total Products
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {products.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 group hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl shadow-lg">
                  <i className="ri-money-dollar-circle-line text-2xl sm:text-3xl text-white"></i>
                </div>
                <div className="ml-4 sm:ml-6">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide">
                    Revenue
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    ₹{totalRevenue}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 group hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center">
                <div className="p-3 sm:p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl shadow-lg">
                  <i className="ri-shopping-cart-line text-2xl sm:text-3xl text-white"></i>
                </div>
                <div className="ml-4 sm:ml-6">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide">
                    Active Products
                  </h3>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                    {products.length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Edit Product Form */}
          {editingProduct && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-edit-line text-lg sm:text-xl text-white"></i>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 break-words">
                    Edit: {editingProduct.name}
                  </h2>
                </div>
                <button
                  onClick={cancelEdit}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  <i className="ri-arrow-left-line"></i>
                  <span>Back</span>
                </button>
              </div>
              <form
                onSubmit={handleEditProduct}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={editProduct.name}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, name: e.target.value })
                    }
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editProduct.price}
                    onChange={(e) =>
                      setEditProduct({ ...editProduct, price: e.target.value })
                    }
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={editProduct.discount}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        discount: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    New Product Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        image: e.target.files[0],
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    Leave empty to keep current image
                  </p>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={editProduct.bgcolor}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        bgcolor: e.target.value,
                      })
                    }
                    className="w-full h-10 sm:h-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={editProduct.textcolor}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        textcolor: e.target.value,
                      })
                    }
                    className="w-full h-10 sm:h-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Panel Color
                  </label>
                  <input
                    type="color"
                    value={editProduct.panelcolor}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        panelcolor: e.target.value,
                      })
                    }
                    className="w-full h-10 sm:h-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 text-white font-bold rounded-xl sm:rounded-2xl hover:from-blue-600 hover:via-indigo-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ri-save-line text-base sm:text-lg"></i>
                    {loading ? "Updating..." : "Update Product"}
                  </button>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gray-300/80 backdrop-blur-sm text-gray-700 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-400/80 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <i className="ri-close-line text-base sm:text-lg"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Enhanced Create Product Form */}
          {showCreateForm && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                    <i className="ri-add-line text-lg sm:text-xl text-white"></i>
                  </div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                    Create New Product
                  </h2>
                </div>
                <button
                  onClick={toggleCreateForm}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                >
                  <i className="ri-arrow-left-line"></i>
                  <span>Back</span>
                </button>
              </div>
              <form
                onSubmit={handleCreateProduct}
                className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8"
              >
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.price}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, price: e.target.value })
                    }
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Discount (₹)
                  </label>
                  <input
                    type="number"
                    value={newProduct.discount}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, discount: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Product Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.files[0] })
                    }
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-4 focus:ring-indigo-200 focus:border-indigo-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={newProduct.bgcolor}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, bgcolor: e.target.value })
                    }
                    className="w-full h-10 sm:h-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Text Color
                  </label>
                  <input
                    type="color"
                    value={newProduct.textcolor}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        textcolor: e.target.value,
                      })
                    }
                    className="w-full h-10 sm:h-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2 sm:mb-3 uppercase tracking-wide">
                    Panel Color
                  </label>
                  <input
                    type="color"
                    value={newProduct.panelcolor}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        panelcolor: e.target.value,
                      })
                    }
                    className="w-full h-10 sm:h-12 border-2 border-gray-200 rounded-xl sm:rounded-2xl shadow-lg"
                  />
                </div>
                <div className="lg:col-span-2 flex flex-col sm:flex-row gap-3 sm:gap-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-bold rounded-xl sm:rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <i className="ri-add-line text-base sm:text-lg"></i>
                    {loading ? "Creating..." : "Create Product"}
                  </button>
                  <button
                    type="button"
                    onClick={toggleCreateForm}
                    className="w-full sm:flex-1 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gray-300/80 backdrop-blur-sm text-gray-700 font-bold rounded-xl sm:rounded-2xl hover:bg-gray-400/80 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2 sm:gap-3"
                  >
                    <i className="ri-close-line text-base sm:text-lg"></i>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Enhanced Products Grid */}
          {!showCreateForm && !editingProduct && (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50">
              <div className="p-4 sm:p-6 lg:p-8 border-b border-gray-200/50">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-product-hunt-line text-lg sm:text-xl text-white"></i>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      Your Products
                    </h2>
                  </div>
                  <button
                    onClick={toggleCreateForm}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    <i className="ri-add-line"></i>
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8">
                  {products.map((product) => (
                    <div
                      key={product._id}
                      className="group rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-500 transform hover:-translate-y-2 hover:shadow-3xl"
                      style={{ background: product.panelcolor || "#ffffff" }}
                    >
                      <div
                        className="h-40 sm:h-48 lg:h-52 flex items-center justify-center border-b border-gray-200/50 overflow-hidden"
                        style={{ background: product.bgcolor || "#f3f4f6" }}
                      >
                        <img
                          className="h-32 sm:h-40 lg:h-44 w-auto object-contain transition-transform duration-500 group-hover:scale-110"
                          src={product.image || "/images/image 80.png"}
                          alt={product.name || "Product"}
                          onError={(e) => {
                            console.error(
                              "Image load error for product:",
                              product._id,
                              "\nFilename:",
                              product.imageFilename,
                              "\nImage type:",
                              typeof product.image
                            );
                            e.target.src = "/images/image 80.png";
                          }}
                        />
                      </div>
                      <div
                        className="p-4 sm:p-5 lg:p-6"
                        style={{ color: product.textcolor || "#374151" }}
                      >
                        <h3 className="font-bold text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <span className="text-xl sm:text-2xl font-bold">
                            ₹{product.price}
                          </span>
                          {product.discount > 0 && (
                            <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                              -₹{product.discount}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => startEditProduct(product)}
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center rounded-xl sm:rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg flex items-center justify-center gap-2"
                          >
                            <i className="ri-edit-line text-sm sm:text-base"></i>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-red-500 to-pink-500 text-white text-center rounded-xl sm:rounded-2xl hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 font-bold shadow-lg flex items-center justify-center gap-2"
                          >
                            <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 sm:p-12 text-center">
                  <i className="ri-product-hunt-line text-5xl sm:text-6xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg sm:text-xl text-gray-600 mb-2">
                    No products yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-4">
                    Start by creating your first product
                  </p>
                  <button
                    onClick={toggleCreateForm}
                    className="px-4 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Create First Product
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
