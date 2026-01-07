import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const AdminAuth = () => {
  const { adminLogin, adminRegister } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await adminLogin(loginForm.email, loginForm.password);

    if (result.success) {
      navigate("/owners/admin");
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const result = await adminRegister(
      regForm.fullname,
      regForm.email,
      regForm.password
    );

    if (result.success) {
      setSuccess("Admin account created successfully!");
      setRegForm({ fullname: "", email: "", password: "" });
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />

      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-3 sm:p-4 rounded-lg bg-red-500 text-white z-50 max-w-xs sm:max-w-md mx-4 text-sm sm:text-base text-center">
          <span className="inline-block">{error}</span>
        </div>
      )}

      {success && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-3 sm:p-4 rounded-lg bg-green-500 text-white z-50 max-w-xs sm:max-w-md mx-4 text-sm sm:text-base text-center">
          <span className="inline-block">{success}</span>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center px-4 py-8 sm:py-0">
        <div className="max-w-4xl w-full flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Admin Login Section */}
          <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <i className="ri-admin-line text-xl sm:text-2xl text-white"></i>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Admin Access
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-2">
                Sign in to your admin account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder-gray-500"
                  type="email"
                  placeholder="Admin Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-mail-line text-gray-400 text-sm sm:text-base"></i>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder-gray-500"
                  type="password"
                  placeholder="Admin Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-lock-line text-gray-400 text-sm sm:text-base"></i>
                </div>
              </div>
              <button
                className="w-full py-2.5 sm:py-3 mt-4 sm:mt-6 text-sm sm:text-base bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In as Admin"}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/"
                className="text-sm sm:text-base text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Back to main site
              </Link>
            </div>
          </div>

          {/* Admin Registration Section */}
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-600 p-6 sm:p-8 flex flex-col justify-center text-white">
            <div className="text-center mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold">
                Create Admin Account
              </h2>
              <p className="mt-2 text-sm sm:text-base opacity-90">
                Register a new admin for the platform
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border-2 border-white/20 rounded-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-300 placeholder-white/70 text-white"
                  type="text"
                  placeholder="Full Name"
                  value={regForm.fullname}
                  onChange={(e) =>
                    setRegForm({ ...regForm, fullname: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-user-line text-white/70 text-sm sm:text-base"></i>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border-2 border-white/20 rounded-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-300 placeholder-white/70 text-white"
                  type="email"
                  placeholder="Admin Email"
                  value={regForm.email}
                  onChange={(e) =>
                    setRegForm({ ...regForm, email: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-mail-line text-white/70 text-sm sm:text-base"></i>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/10 border-2 border-white/20 rounded-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-300 placeholder-white/70 text-white"
                  type="password"
                  placeholder="Password"
                  value={regForm.password}
                  onChange={(e) =>
                    setRegForm({ ...regForm, password: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-lock-line text-white/70 text-sm sm:text-base"></i>
                </div>
              </div>
              <button
                className="w-full py-2.5 sm:py-3 mt-4 sm:mt-6 text-sm sm:text-base bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Admin Account"}
              </button>
            </form>

            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white/10 rounded-lg">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">
                Admin Privileges:
              </h4>
              <ul className="text-xs sm:text-sm opacity-90 space-y-1">
                <li>• Manage product listings</li>
                <li>• View and edit own products</li>
                <li>• Access admin dashboard</li>
                <li>• Upload new products</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAuth;
