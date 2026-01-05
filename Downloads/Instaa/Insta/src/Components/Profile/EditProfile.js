import { useState, useEffect, useRef } from "react";
import { api } from "../../Interceptor/api";
import { useNavigate } from "react-router-dom";
import { Camera, ArrowLeft, X, Check } from "lucide-react";



export const EditProfile = () => {


    const BACKEND_URL ="http://localhost:5000";

    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
     const [selectedFile, setSelectedFile] = useState(null); // Store actual file

    const [form, setForm] = useState({
        name: "",
        username: "",
        bio: "",
        email: "",
        phoneNo: "",
        gender: "",
        profilePicture: ""
    });


    // Fetch current user data
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {

                const mydata = await api.get("/auth/me");
                
                const userId = mydata.data.id; 
                const res = await api.get(`/auth/fullProfile/${userId}`);
                
                setForm({
                    name: res.data.name || "",
                    username: res.data.username || "",
                    bio: res.data.bio || "",
                    email: res.data.email || "",
                    phoneNo: res.data.phoneNo || "",
                    gender: res.data.gender || "",
                    profilePicture: res.data.profilePicture || ""
                });
                
                if (res.data.profilePicture) {
                    setPreviewImage(getImageUrl(res.data.profilePicture));
                }
            } catch (err) {
                console.log(err);
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const getImageUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
            return path;
        }
        return `${BACKEND_URL}${path}`;
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(getImageUrl(reader.result));
                setForm({ ...form, profilePicture: reader.result });
            };
            reader.readAsDataURL(file);

            setSelectedFile(file);
        }
    };

     useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        setSuccess("");

        try {
            // Create FormData for multipart upload
            const formData = new FormData();
            
            // Append text fields
            formData.append("name", form.name);
            formData.append("username", form.username);
            formData.append("bio", form.bio);
            formData.append("email", form.email);
            formData.append("phoneNo", form.phoneNo);
            formData.append("gender", form.gender);

            // Append file only if a new one was selected
            if (selectedFile) {
                formData.append("profilePicture", selectedFile);
            }

            await api.put("/auth/profile", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            setSuccess("Profile updated successfully!");
            
            setTimeout(() => {
                navigate("/profile");
            }, 1500);
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    
                    <h1 className="text-xl font-semibold">Edit Profile</h1>
                    
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="text-blue-500 font-semibold hover:text-blue-600 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Done"}
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-2xl mx-auto px-4 py-6">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
                        <Check size={20} />
                        {success}
                    </div>
                )}
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-2">
                        <X size={20} />
                        {error}
                    </div>
                )}

                {/* Profile Picture Section */}
                <div className="bg-white rounded-xl p-6 mb-4 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div 
                                onClick={handleImageClick}
                                className="w-20 h-20 rounded-full overflow-hidden cursor-pointer group relative"
                             >
                                {previewImage ? (
                                    <img 
                                        src={previewImage} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white text-2xl font-bold">
                                        {form.username?.charAt(0)?.toUpperCase() || "U"}
                                    </div>
                                )}
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                            
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>
                        
                        <div className="flex-1">
                            <h2 className="font-semibold text-lg">{form.username || "Username"}</h2>
                            <button 
                                onClick={handleImageClick}
                                className="text-blue-500 font-semibold text-sm hover:text-blue-600 transition"
                            >
                                Change profile photo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm space-y-5">
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Full Name"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Help people discover your account by using the name you're known by.
                        </p>
                    </div>

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Username"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Bio */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Bio
                        </label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            placeholder="Write something about yourself..."
                            rows={3}
                            maxLength={150}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition resize-none"
                        />
                        <p className="text-xs text-gray-400 mt-1 text-right">
                            {form.bio.length}/150
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200 pt-5">
                        <h3 className="font-semibold text-gray-700 mb-4">Personal Information</h3>
                    </div>

                    

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                            readOnly
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Email cannot be changed here.
                        </p>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            name="phoneNo"
                            value={form.phoneNo}
                            onChange={handleChange}
                            placeholder="+1 234 567 8900"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition"
                        />
                    </div>

                    {/* Gender */}
                    <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">
                            Gender
                        </label>
                        <select
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition bg-white"
                        >
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Submit Button - Mobile */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed md:hidden"
                    >
                        {saving ? (
                            <span className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                Saving...
                            </span>
                        ) : (
                            "Save Changes"
                        )}
                    </button>
                </form>

                {/* Danger Zone */}
                <div className="bg-white rounded-xl p-6 mt-4 shadow-sm">
                    <h3 className="font-semibold text-red-600 mb-3">Danger Zone</h3>
                    <button className="text-red-500 text-sm font-medium hover:text-red-600 transition">
                        Temporarily disable my account
                    </button>
                </div>
            </div>
        </div>
    );
};