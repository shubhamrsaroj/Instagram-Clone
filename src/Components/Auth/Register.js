import { useState, useEffect, useRef } from "react";
import { api } from "../../Interceptor/api";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const navigate =useNavigate();




  //const [showOtp, setShowOtp] = useState(false);
  //const [otp, setOtp] = useState("");

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

  // Handle Registration
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", form);

      if(res.status === 200){
        alert("Successfully Registered");
        navigate("/login");
      }

      //if (res.status === 200) {
        //setShowOtp(true);            // show otp input
      //}

    } catch (err) {
      console.log(err);
    }
  };

  // Handle OTP verification
  // const handleVerifyOtp = async () => {
  //   try {
  //     const res = await api.post("/auth/verifyOtp", {
  //       email: form.email,
  //       otp,
  //     });

  //     if (res.status === 200) {
  //       alert("OTP Verified Successfully!");
  //       navigate("/login");
  //     }
  //   } catch (err) {
  //     console.log(err);
  //     alert("Invalid or expired OTP");
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div ref={cardRef} className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-6">Instagram</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none"
            />

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

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
            >
              Sign Up
            </button>

            <p className="text-center text-sm mt-6">
           
           <button onClick={()=>navigate("/login")}>
                Login
            </button>

        </p>
          </form>
        

        {/* OTP Section
        {showOtp && (
          <div className="space-y-4">
            <p className="text-center font-semibold text-gray-700">
              Enter the OTP sent to your email
            </p>

            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-400 outline-none text-center"
            />

            <button
              onClick={handleVerifyOtp}
              className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition"
            >
              Verify OTP
            </button>
          </div>
        )} */}

        
      </div>
    </div>
  );
};
