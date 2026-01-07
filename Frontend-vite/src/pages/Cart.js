import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../components/Header";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get("/api/cart");
      setCartData(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      console.error("Error response:", error.response);
      if (error.response?.status === 401) {
        setError("Please login to view your cart");
      } else {
        setError(
          "Failed to load cart: " +
            (error.response?.data?.error || error.message)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCart = async (productId, action) => {
    try {
      const response = await axios.post(`/updatecart/${productId}`, { action });
      if (response.data && response.data.success) {
        fetchCart(); // Refresh cart data
      } else {
        setError(response.data?.error || "Failed to update cart");
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      console.error("Error response:", error.response);
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to update cart";
      setError(errorMessage);
      setTimeout(() => setError(""), 5000);
    }
  };

  const removeFromCart = async (productId) => {
    if (window.confirm("Remove this item from cart?")) {
      try {
        console.log("Removing from cart - Product ID:", productId);
        const response = await axios.get(`/removefromcart/${productId}`);

        if (response.data && response.data.success) {
          fetchCart();
          setSuccess("Item removed from cart");
          setTimeout(() => setSuccess(""), 3000);
        } else {
          setError(response.data?.error || "Failed to remove item");
          setTimeout(() => setError(""), 5000);
        }
      } catch (error) {
        console.error("Error removing item:", error);
        console.error("Error response:", error.response);
        const errorMessage =
          error.response?.data?.error ||
          error.message ||
          "Failed to remove item";
        setError(errorMessage);
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const initiatePayment = async () => {
    if (!cartData || !cartData.cart || cartData.cart.length === 0) {
      setError("Cart is empty");
      return;
    }

    setPaymentLoading(true);
    setError("");

    try {
      console.log("Initiating payment...");

      // Create order on backend
      const createOrderResponse = await axios.post(
        "/api/payments/create-order",
        {},
        {
          headers: {
            Accept: "application/json",
          },
        }
      );

      console.log("Order created:", createOrderResponse.data);

      if (!createOrderResponse.data.success) {
        throw new Error(
          createOrderResponse.data.error || "Failed to create order"
        );
      }
      const { order, key } = createOrderResponse.data;

      // Razorpay checkout options
      const options = {
        key: key,
        amount: order.amount,
        currency: "INR",
        name: "Scatch",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying...", response);

            // Verify payment on backend
            const verifyResponse = await axios.post(
              "/api/payments/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Accept: "application/json",
                },
              }
            );

            console.log("Payment verification:", verifyResponse.data);

            if (verifyResponse.data.success) {
              // Payment successful - refresh cart
              alert("Payment Successful! Your order has been placed.");
              fetchCart(); // This should now show empty cart
            } else {
              throw new Error(
                verifyResponse.data.error || "Payment verification failed"
              );
            }
          } catch (verifyError) {
            console.error("Payment verification error:", verifyError);
            setError(
              "Payment verification failed: " +
                (verifyError.response?.data?.error || verifyError.message)
            );
          }
        },
        prefill: {
          name: "",
          email: "",
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            setPaymentLoading(false);
          },
        },
      };

      // Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setError(
        "Failed to initiate payment: " +
          (error.response?.data?.error || error.message)
      );
      setPaymentLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header pageLabel="Shopping Cart" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header pageLabel="Shopping Cart" />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header pageLabel="Shopping Cart" />
      <div className="min-h-screen bg-gray-50">
        {!cartData || cartData.cart.length === 0 ? (
          // Enhanced Empty Cart
          <div className="flex items-center justify-center min-h-96 p-4 sm:p-6">
            <div className="text-center bg-white/70 backdrop-blur-sm border border-white/50 shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 max-w-md w-full">
              <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-xl">
                <i className="ri-shopping-cart-line text-4xl sm:text-5xl lg:text-6xl text-white"></i>
              </div>
              <h2 className="text-2xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-3 sm:mb-4">
                Your cart is empty
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-gray-500 mb-6 sm:mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white font-bold rounded-xl sm:rounded-2xl hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <i className="ri-store-2-line text-base sm:text-lg"></i>
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          // Enhanced Cart Content
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
              {/* Enhanced Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-shopping-bag-line text-lg sm:text-xl text-white"></i>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      Cart Items ({cartData.cart.length})
                    </h2>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {cartData.cart.map((cartItem, index) => {
                      // Add null checking for cart item and product
                      if (!cartItem || !cartItem.product) {
                        console.warn(
                          `Cart item ${index} has null product:`,
                          cartItem
                        );
                        return null;
                      }

                      return (
                        <div
                          key={index}
                          className="group p-4 sm:p-5 lg:p-6 bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl sm:rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                          {/* Product Image */}
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                            <div className="w-full sm:w-20 md:w-24 lg:w-28 h-20 sm:h-20 md:h-24 lg:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center overflow-hidden shadow-lg border border-gray-200 group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                              {cartItem.product && cartItem.product.image ? (
                                <img
                                  className="h-16 sm:h-16 md:h-20 lg:h-24 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                                  src={
                                    cartItem.product.image ||
                                    "/images/image 80.png"
                                  }
                                  alt={cartItem.product.name || "Product"}
                                  onError={(e) => {
                                    console.log(
                                      "Cart image load error for product:",
                                      cartItem.product._id,
                                      "Image:",
                                      cartItem.product.image
                                    );
                                    e.target.src = "/images/image 80.png";
                                  }}
                                />
                              ) : (
                                <img
                                  className="h-14 sm:h-16 lg:h-20 w-auto object-contain"
                                  src="/images/image 80.png"
                                  alt="placeholder"
                                />
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 w-full">
                              <h3 className="font-bold text-base sm:text-lg lg:text-xl text-gray-800 mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
                                {cartItem.product.name || "Unknown Product"}
                              </h3>
                              <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                                <i className="ri-store-2-line mr-1 sm:mr-2"></i>
                                By:{" "}
                                {cartItem.product &&
                                cartItem.product.owner &&
                                cartItem.product.owner.fullname
                                  ? cartItem.product.owner.fullname
                                  : "Unknown Seller"}
                              </p>
                              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                                  ₹{cartItem.product.price || 0}
                                </span>
                                {cartItem.product.discount &&
                                  cartItem.product.discount > 0 && (
                                    <>
                                      <span className="text-sm sm:text-base lg:text-lg line-through text-gray-400">
                                        ₹
                                        {(cartItem.product.price || 0) +
                                          (cartItem.product.discount || 0)}
                                      </span>
                                      <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg">
                                        ₹{cartItem.product.discount} off
                                      </span>
                                    </>
                                  )}
                              </div>
                            </div>

                            {/* Enhanced Quantity Controls - Moved to separate row on mobile */}
                            <div className="flex sm:flex-col items-center justify-between sm:justify-start w-full sm:w-auto gap-4 mt-3 sm:mt-0">
                              <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                                <button
                                  onClick={() =>
                                    updateCart(
                                      cartItem.product?._id,
                                      "decrease"
                                    )
                                  }
                                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 shadow-md"
                                >
                                  <i className="ri-subtract-line text-sm sm:text-base lg:text-lg"></i>
                                </button>

                                <span className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg sm:rounded-xl font-bold min-w-12 sm:min-w-14 lg:min-w-16 text-center shadow-lg">
                                  {cartItem.quantity || 0}
                                </span>

                                <button
                                  onClick={() =>
                                    updateCart(
                                      cartItem.product?._id,
                                      "increase"
                                    )
                                  }
                                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center hover:from-gray-300 hover:to-gray-400 transition-all duration-300 transform hover:scale-110 shadow-md"
                                >
                                  <i className="ri-add-line text-sm sm:text-base lg:text-lg"></i>
                                </button>
                              </div>

                              {/* Enhanced Item Total */}
                              <div className="text-right sm:mt-4">
                                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-indigo-600 mb-1 sm:mb-2">
                                  ₹
                                  {((cartItem.product && cartItem.product.price
                                    ? cartItem.product.price
                                    : 0) -
                                    (cartItem.product &&
                                    cartItem.product.discount
                                      ? cartItem.product.discount
                                      : 0)) *
                                    cartItem.quantity}
                                </p>
                                <button
                                  onClick={() =>
                                    removeFromCart(cartItem.product?._id)
                                  }
                                  className="inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium hover:bg-red-50 px-2 sm:px-3 py-1 sm:py-2 rounded-lg transition-all duration-300"
                                >
                                  <i className="ri-delete-bin-line text-sm sm:text-base"></i>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Enhanced Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 p-4 sm:p-6 lg:p-8 lg:sticky lg:top-8">
                  <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                      <i className="ri-bill-line text-lg sm:text-xl text-white"></i>
                    </div>
                    <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">
                      Order Summary
                    </h2>
                  </div>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Enhanced Item Breakdown */}
                    <div className="bg-gray-50/80 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6">
                      {cartData.cart.map((cartItem, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-1.5 sm:py-2 text-xs sm:text-sm"
                        >
                          <span className="text-gray-700 font-medium line-clamp-1 pr-2">
                            {cartItem.product && cartItem.product.name
                              ? cartItem.product.name
                              : "Unknown product"}{" "}
                            × {cartItem.quantity}
                          </span>
                          <span className="text-gray-900 font-bold whitespace-nowrap">
                            ₹
                            {((cartItem.product && cartItem.product.price
                              ? cartItem.product.price
                              : 0) -
                              (cartItem.product && cartItem.product.discount
                                ? cartItem.product.discount
                                : 0)) *
                              cartItem.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Enhanced Totals */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <span className="text-sm sm:text-base text-gray-600 font-medium">
                          Subtotal
                        </span>
                        <span className="text-sm sm:text-base text-gray-900 font-bold">
                          ₹{cartData.totalBill}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <span className="text-sm sm:text-base text-gray-600 font-medium">
                          Platform Fee
                        </span>
                        <span className="text-sm sm:text-base text-gray-900 font-bold">
                          ₹{cartData.platformFee}
                        </span>
                      </div>

                      <div className="flex justify-between items-center py-1.5 sm:py-2">
                        <span className="text-sm sm:text-base text-gray-600 font-medium">
                          Shipping
                        </span>
                        <span className="text-sm sm:text-base text-green-600 font-bold flex items-center gap-1 sm:gap-2">
                          <i className="ri-truck-line text-sm sm:text-base"></i>
                          FREE
                        </span>
                      </div>

                      {cartData.cart.map((cartItem, index) => {
                        if (cartItem.product && cartItem.product.discount > 0) {
                          return (
                            <div
                              key={index}
                              className="flex justify-between items-center py-1.5 sm:py-2"
                            >
                              <span className="text-sm sm:text-base text-gray-600 font-medium">
                                Discount
                              </span>
                              <span className="text-sm sm:text-base text-green-600 font-bold">
                                -₹
                                {cartItem.product.discount * cartItem.quantity}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}

                      <div className="border-t-2 border-gray-200 pt-3 sm:pt-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg sm:text-xl font-bold text-gray-900">
                            Total
                          </span>
                          <span className="text-xl sm:text-2xl font-bold text-green-600">
                            ₹{cartData.finalBill}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Checkout Button */}
                    <button
                      onClick={initiatePayment}
                      disabled={paymentLoading}
                      className="w-full py-3 sm:py-4 text-sm sm:text-base lg:text-lg bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white font-bold rounded-xl sm:rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      <i
                        className={`${
                          paymentLoading
                            ? "ri-loader-4-line animate-spin"
                            : "ri-secure-payment-line"
                        } text-lg sm:text-xl`}
                      ></i>
                      {paymentLoading ? "Processing..." : "Proceed to Checkout"}
                    </button>

                    {/* Enhanced Additional Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 border border-blue-200">
                      <h4 className="font-bold text-sm sm:text-base text-blue-800 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <i className="ri-shield-check-line text-white text-sm sm:text-base"></i>
                        </div>
                        Secure Checkout
                      </h4>
                      <ul className="text-xs sm:text-sm text-blue-700 space-y-1.5 sm:space-y-2">
                        <li className="flex items-center gap-2 sm:gap-3">
                          <i className="ri-lock-line text-blue-500 flex-shrink-0"></i>
                          <span>SSL encrypted payment</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <i className="ri-money-dollar-circle-line text-blue-500 flex-shrink-0"></i>
                          <span>Money-back guarantee</span>
                        </li>
                        <li className="flex items-center gap-2 sm:gap-3">
                          <i className="ri-truck-line text-blue-500 flex-shrink-0"></i>
                          <span>Fast & free delivery</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
