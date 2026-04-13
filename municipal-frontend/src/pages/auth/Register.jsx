import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import { registerUser } from "../../services/authService";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await registerUser(form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 px-4">

      {/* Glass Card */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">
            Smart Civic Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            AI-Powered Complaint Management System
          </p>
        </div>

        <h2 className="text-xl font-semibold text-center mb-6">
          Create Your Account 
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />

          {/* Password Field */}
          <div className="mb-5 relative">
            <label className="block text-sm font-medium mb-1">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:via-indigo-900"
              placeholder="Create password"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-slate-500 hover:text-blue-600 transition"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-indigo-900 hover:bg-indigo-600 text-white py-2.5 rounded-lg font-medium transition shadow-md hover:shadow-lg"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* Footer */}
        <p className="text-sm text-center text-slate-500 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-900 hover:underline font-medium">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}