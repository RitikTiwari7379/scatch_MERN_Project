import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ pageLabel, excludeNavbar = false }) => {
  const { user, owner, logout, adminLogout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user) {
        await logout();
      } else if (owner) {
        await adminLogout();
      }
      // Force navigation to home and reload the page to ensure clean state
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
      // Force navigation anyway
      navigate("/");
      window.location.reload();
    }
  };

  if (excludeNavbar) return null;

  // Show loading spinner while auth is being checked
  if (loading) {
    return (
      <>
        <nav className="fixed inset-x-0 z-50 bg-white shadow-lg border-b border-gray-200 px-11 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link className="text-4xl font-extrabold text-gray-800" to="/">
              Scatch
            </Link>
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </nav>
        <div className="h-20"></div>
      </>
    );
  }

  return (
    <>
      <nav className="fixed inset-x-0 z-50 bg-white shadow-lg border-b border-gray-200 px-11 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section: Branding + Page Label */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link className="text-4xl font-extrabold text-gray-800" to="/">
                Scatch
              </Link>
              {pageLabel && (
                <>
                  <div className="h-8 w-px bg-gray-300"></div>
                  <h1 className="text-xl font-semibold text-gray-600 bg-gray-100 px-4 py-2 rounded-lg border border-gray-200">
                    {pageLabel}
                  </h1>
                </>
              )}
            </div>
          </div>

          {/* Right Section: Navigation Links */}
          <div className="flex items-center gap-6">
            {user ? (
              // Logged-in regular user navigation
              <>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  to="/shop"
                >
                  Shop
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  to="/cart"
                >
                  Cart
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  to="/account"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <i className="ri-logout-circle-line"></i>
                  Logout
                </button>
              </>
            ) : owner ? (
              // Logged-in owner (admin) navigation
              <>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  to="/owners/admin"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <i className="ri-logout-circle-line"></i>
                  Logout
                </button>
              </>
            ) : (
              // Guest navigation - no shop access without login
              <>
                <Link
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  to="/"
                >
                  Login / Register
                </Link>
                <Link
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                  to="/owners/admin-auth"
                >
                  <i className="ri-admin-line"></i>
                  Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      <div className="h-20"></div>
    </>
  );
};

export default Header;
