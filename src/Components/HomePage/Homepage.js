import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Interceptor/api';
import instaLogo from '../images/insta.png';

// Instagram Logo Component
const InstagramLogo = () => (
  <div className="flex justify-center mb-8">
    <img src={instaLogo} alt="Instagram" className="h-14" />
  </div>
);

// Phone Mockup Component - Overlapping phones like Instagram's design
const PhoneMockup = () => {
  const [currentScreen, setCurrentScreen] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentScreen((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-[468px] h-[634px] hidden lg:block">
      {/* Background Phone */}
      <div className="absolute left-0 top-0 w-[250px] h-[510px] transform">
        <div className="relative w-full h-full bg-white rounded-[40px] shadow-2xl border-[14px] border-black overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[100px] h-[25px] bg-black rounded-b-3xl z-10"></div>

          {/* Screen Content */}
          <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-400 to-red-400">
            {/* Mock Instagram Story Grid */}
            <div className="grid grid-cols-3 gap-[2px] h-full p-8 pt-10">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-white/20 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Front Phone */}
      <div className="absolute left-[150px] top-[30px] w-[280px] h-[570px]">
        <div className="relative w-full h-full bg-white rounded-[45px] shadow-2xl border-[14px] border-black overflow-hidden">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-3xl z-10"></div>

          {/* Screen Content - Instagram Profile */}
          <div className="w-full h-full bg-white overflow-hidden">
            {/* Status Bar */}
            <div className="h-[30px] bg-white flex items-center justify-between px-4 pt-2 text-[10px]">
              <span className="font-semibold">9:41</span>
            </div>

            {/* Profile Header */}
            <div className="px-4 pt-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-[70px] h-[70px] rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
                    <div className="w-full h-full rounded-full bg-white p-[3px]">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-purple-500"></div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-center">
                    <div>
                      <div className="font-semibold text-sm">528</div>
                      <div className="text-xs text-gray-500">Posts</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">874K</div>
                      <div className="text-xs text-gray-500">Followers</div>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">441</div>
                      <div className="text-xs text-gray-500">Following</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="text-xs mb-3">
                <div className="font-semibold">Jeongsu Seo</div>
                <div className="text-gray-700">I'm 23yrs old</div>
                <div className="text-gray-700">🎀 loft2329@gmail.com</div>
                <div className="text-blue-900">Followed by analog and autonomy</div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mb-3">
                <button className="flex-1 bg-[#0095f6] text-white text-xs font-semibold py-1.5 rounded-lg">
                  Follow
                </button>
                <button className="flex-1 bg-gray-200 text-black text-xs font-semibold py-1.5 rounded-lg">
                  Message
                </button>
                <button className="bg-gray-200 text-black text-xs font-semibold px-3 py-1.5 rounded-lg">
                  Email
                </button>
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex border-t border-gray-300">
              <div className="flex-1 py-3 flex justify-center border-t-2 border-black">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </div>
            </div>

            {/* Photo Grid */}
            <div className="grid grid-cols-3 gap-[2px]">
              {[
                'from-blue-400 to-blue-600',
                'from-pink-400 to-red-500',
                'from-green-400 to-teal-500',
                'from-orange-400 to-yellow-500',
                'from-purple-400 to-pink-500',
                'from-indigo-400 to-blue-500',
              ].map((gradient, i) => (
                <div key={i} className={`aspect-square bg-gradient-to-br ${gradient}`}></div>
              ))}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.005 16.545a2.997 2.997 0 012.997-2.997h0A2.997 2.997 0 0115 16.545V22h7V11.543L12 2 2 11.543V22h7.005z" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M12 8v8m-4-4h8" />
              </svg>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12z" />
              </svg>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" fill="white" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    const res = await api.post("/auth/login", formData);

    const { token } = res.data;

    localStorage.setItem("token", token);

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
        <InstagramLogo />

        <form className="space-y-2" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative">
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Phone number, username, or email"
              className="w-full px-2 py-2 text-xs bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400"
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
              className="w-full px-2 py-2 pr-16 text-xs bg-gray-50 border border-gray-300 rounded-sm focus:outline-none focus:border-gray-400"
            />
            {formData.password.length > 0 && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm font-semibold text-gray-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            )}
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-1.5 mt-3 text-sm font-semibold text-white rounded-lg transition-colors ${isFormValid
              ? 'bg-[#0095f6] hover:bg-[#1877f2] cursor-pointer'
              : 'bg-[#4cb5f9] cursor-not-allowed opacity-70'
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
        <a href="#" className="block text-center text-xs text-[#00376b] mt-5">
          Forgot password?
        </a>
      </div>

      {/* Sign Up Box */}
      <div className="bg-white border border-gray-300 p-6 text-center">
        <p className="text-sm">
          Don't have an account?{' '}
          <button
            onClick={() => navigate("/register")}
            className="text-[#0095f6] font-semibold hover:text-[#00376b]"
          >
            Sign up
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
      <main className="flex-1 flex items-center justify-center py-8 px-4">
        <div className="flex items-center gap-8 max-w-[935px] w-full justify-center">
          {/* Phone Mockup - Hidden on mobile, shown on large screens */}
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