import React, {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Interceptor/api';

// Instagram Logo Component
const InstagramLogo = () => (
  <h1 className="text-5xl font-serif italic mb-6">Instagram</h1>
);

// Phone Mockup Component
const PhoneMockup = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const images = [
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot1.png/fdfe239b7c9f.png',
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot2.png/4d62acb667fb.png',
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot3.png/94edb770accf.png',
    'https://www.instagram.com/static/images/homepage/screenshots/screenshot4.png/a4fd825e3571.png',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className="hidden lg:block relative">
      <img
        src="https://www.instagram.com/static/images/homepage/phones/home-phones.png/1dc085cdb87d.png"
        alt="Phone"
        className="w-[380px]"
      />
      <div className="absolute top-6 right-14">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Screenshot ${index + 1}`}
            className={`w-[250px] absolute top-0 left-0 transition-opacity duration-1000 ${
              currentImage === index ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = () => {

  const navigate= useNavigate();  

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit=async(e)=>{

        e.preventDefault();
        
        const res = await api.post("/auth/login",formData);

        const {token} =res.data;

        localStorage.setItem("token",token);
        
        navigate("/instagramD");
    
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isFormValid = formData.email?.length > 0 && formData.password.length > 2;

  return (
    <div className="w-full max-w-[350px]">
      {/* Login Box */}
      <div className="bg-white border border-gray-300 p-10 mb-3">
        <div className="flex justify-center mb-8">
          <InstagramLogo />
        </div>

        <form className="space-y-2"
        onSubmit={handleSubmit}
        >
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Phone number, username, or email"
              className="w-full px-3 py-2 text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-3 py-2 pr-16 text-sm bg-gray-50 border border-gray-300 rounded focus:outline-none focus:border-gray-400"
            />
            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-2 mt-2 text-sm font-semibold text-white rounded ${
              isFormValid
                ? 'bg-blue-500 hover:bg-blue-600 cursor-pointer'
                : 'bg-blue-300 cursor-not-allowed'
            }`}
           
          >
            Log in
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-sm font-semibold text-gray-500">OR</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Facebook Login */}
        <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#385185]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
          </svg>
          Log in with Facebook
        </button>

        {/* Forgot Password */}
        <a href="#" className="block text-center text-xs text-[#385185] mt-5">
          Forgot password?
        </a>
      </div>

      {/* Sign Up Box */}
      <div className="bg-white border border-gray-300 p-5 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <button onClick={()=>navigate("/register")}
          >
              SignUp
          </button>
        </p>
      </div>

      {/* App Download */}
      <div className="mt-5 text-center">
        <p className="text-sm mb-4">Get the app.</p>
        <div className="flex justify-center gap-2">
          <a href="#">
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yz/r/c5Rp7Ym-Klz.png"
              alt="Get it on Google Play"
              className="h-10"
            />
          </a>
          <a href="#">
            <img
              src="https://static.cdninstagram.com/rsrc.php/v3/yu/r/EHY6QnZYdNX.png"
              alt="Get it from Microsoft"
              className="h-10"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

// Footer Component
const Footer = () => {
  const links = [
    'Meta', 'About', 'Blog', 'Jobs', 'Help', 'API', 'Privacy',
    'Terms', 'Locations', 'Instagram Lite', 'Threads',
    'Contact Uploading & Non-Users', 'Meta Verified'
  ];

  return (
    <footer className="py-8 text-center">
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4 max-w-4xl mx-auto px-4">
        {links.map((link, index) => (
          <a
            key={index}
            href="#"
            className="text-xs text-gray-500 hover:underline"
          >
            {link}
          </a>
        ))}
      </div>
      <div className="flex justify-center items-center gap-4 text-xs text-gray-500">
        <select className="bg-transparent border-none outline-none cursor-pointer">
          <option>English</option>
          <option>Español</option>
          <option>Français</option>
          <option>日本語</option>
        </select>
        <span>© 2024 Instagram from Meta</span>
      </div>
    </footer>
  );
};

// Main App Component
const InstagramLoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-8">
        <div className="flex items-center gap-8">
          {/* Phone Mockup - Hidden on mobile */}
          <PhoneMockup />

          {/* Login Form */}
          <LoginForm />
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default InstagramLoginPage;