import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header = ({ pageLabel, excludeNavbar = false }) => {
  const { user, owner, logout, adminLogout, loading } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        <nav className="fixed inset-x-0 z-50 bg-white shadow-lg border-b border-gray-200 px-4 sm:px-6 lg:px-11 py-3 sm:py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <Link
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800"
              to="/"
            >
              Scatch
            </Link>
            <div className="animate-pulse flex space-x-2 sm:space-x-4">
              <div className="h-8 w-16 sm:w-20 bg-gray-300 rounded"></div>
              <div className="h-8 w-16 sm:w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        </nav>
        <div className="h-16 sm:h-20"></div>
      </>
    );
  }

  return (
    <>
      <nav className="fixed inset-x-0 z-50 bg-white shadow-lg border-b border-gray-200 px-4 sm:px-6 lg:px-11 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left Section: Branding + Page Label */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 flex-1 min-w-0">
            <Link
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 whitespace-nowrap"
              to="/"
            >
              Scatch
            </Link>
            {pageLabel && (
              <>
                <div className="hidden sm:block h-6 sm:h-8 w-px bg-gray-300"></div>
                <h1 className="hidden sm:block text-sm sm:text-base lg:text-xl font-semibold text-gray-600 bg-gray-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg border border-gray-200 truncate">
                  {pageLabel}
                </h1>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">
            {user ? (
              // Logged-in regular user navigation
              <>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors whitespace-nowrap"
                  to="/shop"
                >
                  Shop
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors whitespace-nowrap"
                  to="/cart"
                >
                  Cart
                </Link>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors whitespace-nowrap"
                  to="/account"
                >
                  My Account
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 xl:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap text-sm xl:text-base"
                >
                  <i className="ri-logout-circle-line"></i>
                  <span className="hidden xl:inline">Logout</span>
                  <span className="xl:hidden">Exit</span>
                </button>
              </>
            ) : owner ? (
              // Logged-in owner (admin) navigation
              <>
                <Link
                  className="text-gray-600 hover:text-gray-800 font-medium transition-colors whitespace-nowrap"
                  to="/owners/admin"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 xl:px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors whitespace-nowrap text-sm xl:text-base"
                >
                  <i className="ri-logout-circle-line"></i>
                  <span className="hidden xl:inline">Logout</span>
                  <span className="xl:hidden">Exit</span>
                </button>
              </>
            ) : (
              // Guest navigation - no shop access without login
              <>
                <Link
                  className="px-3 xl:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap text-sm xl:text-base"
                  to="/"
                >
                  Login / Register
                </Link>
                <Link
                  className="flex items-center gap-2 px-3 xl:px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors whitespace-nowrap text-sm xl:text-base"
                  to="/owners/admin-auth"
                >
                  <i className="ri-admin-line"></i>
                  <span className="hidden xl:inline">Admin</span>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 mt-3 pt-3">
            <div className="flex flex-col space-y-3">
              {user ? (
                // Logged-in regular user navigation
                <>
                  <Link
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg"
                    to="/shop"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="ri-store-2-line mr-2"></i>
                    Shop
                  </Link>
                  <Link
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg"
                    to="/cart"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="ri-shopping-cart-line mr-2"></i>
                    Cart
                  </Link>
                  <Link
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg"
                    to="/account"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="ri-account-circle-line mr-2"></i>
                    My Account
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-left"
                  >
                    <i className="ri-logout-circle-line"></i>
                    Logout
                  </button>
                </>
              ) : owner ? (
                // Logged-in owner (admin) navigation
                <>
                  <Link
                    className="text-gray-600 hover:text-gray-800 font-medium transition-colors py-2 px-3 hover:bg-gray-50 rounded-lg"
                    to="/owners/admin"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="ri-dashboard-line mr-2"></i>
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-left"
                  >
                    <i className="ri-logout-circle-line"></i>
                    Logout
                  </button>
                </>
              ) : (
                // Guest navigation
                <>
                  <Link
                    className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                    to="/"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="ri-login-circle-line mr-2"></i>
                    Login / Register
                  </Link>
                  <Link
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    to="/owners/admin-auth"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="ri-admin-line"></i>
                    Admin
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      <div className="h-16 sm:h-20"></div>
    </>
  );
};

export default Header;
