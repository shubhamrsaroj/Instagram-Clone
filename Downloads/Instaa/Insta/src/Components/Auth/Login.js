import { useState, useEffect, useRef } from "react";
import { api } from "../../Interceptor/api";
import { useNavigate } from "react-router-dom";


export const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate=useNavigate();

  const [error, setError] = useState("");
  const cardRef = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    card.style.opacity = 0;
    card.style.transform = "translateY(20px)";

    setTimeout(() => {
      card.style.transition = "0.4s ease";
      card.style.opacity = 1;
      card.style.transform = "translateY(0)";
    }, 50);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);

      if (res.status === 200) {
        const { token } = res.data;

        // Save token in localStorage
        localStorage.setItem("token", token);

        alert("Login Successful!");
        // Redirect to homepage or dashboard
        // e.g., navigate("/dashboard");
        navigate("/instagramD");
      }
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div ref={cardRef} className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          
             
             <button onClick={()=>navigate("/register")}>
                   Sign Up
             </button>

        </p>
      </div>
    </div>
  );
};
