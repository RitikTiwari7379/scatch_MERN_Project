import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "../components/Header";

const Home = () => {
  const { login, register } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Registration form state
  const [regForm, setRegForm] = useState({
    fullname: "",
    email: "",
    password: "",
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(loginForm.email, loginForm.password);

    if (result.success) {
      window.location.href = "/shop";
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

    const result = await register(
      regForm.fullname,
      regForm.email,
      regForm.password
    );

    if (result.success) {
      setSuccess("Account created successfully!");
      setRegForm({ fullname: "", email: "", password: "" });
      // Optionally redirect to shop after a delay
      setTimeout(() => {
        window.location.href = "/shop";
      }, 1500);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Header />

      {error && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg bg-red-500 text-white z-50">
          <span className="inline-block">{error}</span>
        </div>
      )}

      {success && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-4 rounded-lg bg-green-500 text-white z-50">
          <span className="inline-block">{success}</span>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full flex bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* User Login Section */}
          <div className="w-1/2 p-8 flex flex-col justify-center">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-user-line text-2xl text-white"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder-gray-500"
                  type="email"
                  placeholder="Email Address"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, email: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-mail-line text-gray-400"></i>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-300 placeholder-gray-500"
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm({ ...loginForm, password: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-lock-line text-gray-400"></i>
                </div>
              </div>
              <button
                className="w-full py-3 mt-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/owners/admin-auth"
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Admin? Sign in here →
              </Link>
            </div>
          </div>

          {/* User Registration Section */}
          <div className="w-1/2 bg-gradient-to-br from-blue-600 to-indigo-600 p-8 flex flex-col justify-center text-white">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Join Scatch</h2>
              <p className="mt-2 opacity-90">
                Create your account and start shopping
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-300 placeholder-white/70 text-white"
                  type="text"
                  placeholder="Full Name"
                  value={regForm.fullname}
                  onChange={(e) =>
                    setRegForm({ ...regForm, fullname: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-user-line text-white/70"></i>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-300 placeholder-white/70 text-white"
                  type="email"
                  placeholder="Email Address"
                  value={regForm.email}
                  onChange={(e) =>
                    setRegForm({ ...regForm, email: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-mail-line text-white/70"></i>
                </div>
              </div>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-lg focus:border-white focus:bg-white/20 focus:outline-none transition-all duration-300 placeholder-white/70 text-white"
                  type="password"
                  placeholder="Password"
                  value={regForm.password}
                  onChange={(e) =>
                    setRegForm({ ...regForm, password: e.target.value })
                  }
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <i className="ri-lock-line text-white/70"></i>
                </div>
              </div>
              <button
                className="w-full py-3 mt-6 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <div className="mt-8 p-4 bg-white/10 rounded-lg">
              <h4 className="font-semibold mb-2">Member Benefits:</h4>
              <ul className="text-sm opacity-90 space-y-1">
                <li>• Browse premium products</li>
                <li>• Add items to cart</li>
                <li>• Secure checkout process</li>
                <li>• Order tracking & history</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
