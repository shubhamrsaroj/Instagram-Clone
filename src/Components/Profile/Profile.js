// InstagramProfile.jsx
import React, { useCallback, useEffect, useState } from 'react';
import { api } from '../../Interceptor/api';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef } from 'react';
import { GrUpload } from "react-icons/gr";

// Icons Component

const BACKEND_URL = "http://localhost:5000";
const Icons = {
  Grid: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  ),
  Reels: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
    </svg>
  ),
  Tagged: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Verified: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3b82f6" className="w-5 h-5">
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  ),
  Heart: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
    </svg>
  ),
  Comment: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
    </svg>
  ),
  Menu: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  ),
  Plus: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  ),
  ChevronDown: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  ),
  Play: () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
  ),
  Bookmark: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
    </svg>
  ),
};

// Profile Data


// Story Highlights Data
const highlights = [
  { id: 1, name: "Travel", image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&h=100&fit=crop" },
  { id: 2, name: "Code", image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=100&h=100&fit=crop" },
  { id: 3, name: "Food", image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=100&h=100&fit=crop" },
  { id: 4, name: "Pets", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop" },
  { id: 5, name: "Music", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&h=100&fit=crop" },
  { id: 6, name: "Gym", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100&h=100&fit=crop" },
];




// Story Highlight Component
const StoryHighlight = ({ highlight, isNew = false }) => (
  <div className="flex flex-col items-center space-y-1 cursor-pointer flex-shrink-0">
    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full p-[2px] ${isNew ? 'bg-gray-200 dark:bg-gray-700' : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500'}`}>
      <div className="w-full h-full rounded-full bg-white dark:bg-black p-[2px]">
        {isNew ? (
          <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Icons.Plus />
          </div>
        ) : (
          <img
            src={highlight.image}
            alt={highlight.name}
            className="w-full h-full rounded-full object-cover"
          />
        )}
      </div>
    </div>
    <span className="text-xs text-gray-900 dark:text-white truncate w-16 md:w-20 text-center">
      {isNew ? "New" : highlight.name}
    </span>
  </div>
);

// Stat Component
const Stat = ({ value, label }) => (
  <div className="text-center md:text-left">
    <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    <span className="text-gray-900 dark:text-white ml-1">{label}</span>
  </div>
);

// Mobile Stat Component
const MobileStat = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="font-semibold text-gray-900 dark:text-white text-lg">{value}</span>
    <span className="text-gray-500 dark:text-gray-400 text-sm">{label}</span>
  </div>
);




// Main Profile Component
const InstagramProfile = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [darkMode, setDarkMode] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);

  const tabs = [
    { id: 'posts', icon: <Icons.Grid />, label: 'Posts' },
    { id: 'reels', icon: <Icons.Reels />, label: 'Reels' },
    { id: 'tagged', icon: <Icons.Tagged />, label: 'Tagged' },
  ];

  // Likes Modal Component - Shows list of users who liked the post
  const LikesModal = ({ isOpen, onClose, likedUsers, getImageUrl }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden w-96 max-h-[400px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Likes
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {likedUsers.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No likes yet
              </div>
            ) : (
              likedUsers.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center space-x-3">
                    {/* Profile Picture */}
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200">
                      {user.profilePicture ? (
                        <img
                          src={getImageUrl(user.profilePicture)}
                          alt={user.username}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {user.username?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>

                    {/* Username & Name */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {user.username}
                      </p>
                      {user.name && (
                        <p className="text-gray-500 text-sm">
                          {user.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Optional Follow Button */}
                  <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition">
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const { id } = useParams();

  const FollowModal = ({ isOpen, onClose, followersData }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden w-96 max-h-[400px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              followers
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {followersData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No likes yet
              </div>
            ) : (
              followersData.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center space-x-3">


                    {/* Username & Name */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {user.username}
                      </p>
                      {user.name && (
                        <p className="text-gray-500 text-sm">
                          {user.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Optional Follow Button */}
                  <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition">
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };


  const FollowingModal = ({ isOpen, onClose, followingData }) => {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/60 z-[70] flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden w-96 max-h-[400px] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div></div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              followers
            </h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto">
            {followingData.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No likes yet
              </div>
            ) : (
              followingData.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <div className="flex items-center space-x-3">


                    {/* Username & Name */}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">
                        {user.username}
                      </p>
                      {user.name && (
                        <p className="text-gray-500 text-sm">
                          {user.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Optional Follow Button */}
                  <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white text-sm font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition">
                    Follow
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };



  // Post Detail Modal Component with Edit/Delete Options
  const PostDetailModal = ({ post, onClose, profileData, getImageUrl, onDelete, onEdit, profileId }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [showOptionsMenu, setShowOptionsMenu] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showLikesModal, setShowLikesModal] = useState(false);
    const [likedCount, setLikedCount] = useState(0);
    const [likedUsers, setLikedUsers] = useState([]);
    // ADD THIS LINE
    const optionsRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target)) {
          setShowOptionsMenu(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    useEffect(() => {
      const fetchData = async () => {
        try {
          const profileData = await api.get(`/auth/profileId/${profileId}/postsData/${post._id}`);

          // Use the setter functions from props
          setLikedCount(profileData.data.likedCount);
          setLikedUsers(profileData.data.likedUsers);
        } catch (error) {
          console.error("Error fetching likes:", error);
        }
      };

      if (post?._id) {
        fetchData();
      }
    }, [post._id, profileId]); // Add dependencies



    const handleDelete = async () => {
      try {

        const users = await api.get("/auth/me");

        const ids = users.data.id;

        const profileId = await api.get(`/auth/posts/${ids}`);

        const pId = profileId.data.profileId;


        const posts = post._id;

        await api.delete(`/auth/profile/${pId}/posts/${posts}`);
        if (onDelete) {
          onDelete(post._id);
        }
        onClose();
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("Failed to delete post");
      }
    };

    const handleEdit = () => {
      setShowOptionsMenu(false);
      if (onEdit) {
        onEdit(post);
      }
    };

    if (!post) return null;

    return (
      <div
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:opacity-70 transition z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div
            className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden w-80">
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Post?
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Are you sure you want to delete this post? This action cannot be undone.
                </p>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleDelete}
                  className="w-full py-3 text-red-500 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Delete
                </button>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-3 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Content */}
        <div
          className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image Section */}
          <div className="md:w-3/5 bg-black flex items-center justify-center">
            <img
              src={getImageUrl(post.image)}
              alt="Post"
              className="w-full h-full object-contain max-h-[50vh] md:max-h-[90vh]"
            />
          </div>

          {/* Details Section */}
          <div className="md:w-2/5 flex flex-col max-h-[40vh] md:max-h-[90vh]">
            {/* Header with Three Dots Menu */}
            <div className="flex items-center space-x-3 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                {profileData.profilePicture ? (
                  <img
                    src={getImageUrl(profileData.profilePicture)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {profileData.username}
                </p>
                <p className="text-gray-500 text-xs">
                  {post.location || ""}
                </p>
              </div>

              {/* Three Dots Button with Dropdown */}
              <div className="relative" ref={optionsRef}>
                <button
                  onClick={() => setShowOptionsMenu(!showOptionsMenu)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showOptionsMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[150px] z-10">
                    {/* Edit Option */}
                    <button
                      onClick={handleEdit}
                      className="w-full px-4 py-2.5 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      <span>Edit</span>
                    </button>

                    {/* Divider */}
                    <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                    {/* Delete Option */}
                    <button
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowDeleteConfirm(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-3 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Rest of your modal content remains the same... */}
            {/* Caption & Comments Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Caption */}
              {post.caption && (
                <div className="flex space-x-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {profileData.profilePicture ? (
                      <img
                        src={getImageUrl(profileData.profilePicture)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white text-sm">
                      <span className="font-semibold mr-2">{profileData.username}</span>
                      {post.caption}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formatDate(post.createdAt)}
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center py-8 text-gray-400 text-sm">
                No comments yet.
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`hover:opacity-70 transition ${isLiked ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
                  >
                    {isLiked ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    )}
                  </button>
                  <button className="text-gray-900 dark:text-white hover:opacity-70 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                    </svg>
                  </button>
                  <button className="text-gray-900 dark:text-white hover:opacity-70 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                  </button>
                </div>
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className="hover:opacity-70 transition text-gray-900 dark:text-white"
                >
                  {isSaved ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
                      <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                  )}
                </button>
              </div>

              <button
                onClick={() => setShowLikesModal(true)}
                className="font-semibold text-gray-900 dark:text-white text-sm mb-1 hover:opacity-70 transition text-left"
              >
                {likedCount} likes
              </button>

              <LikesModal
                isOpen={showLikesModal}
                onClose={() => setShowLikesModal(false)}
                likedUsers={likedUsers}  // This should now come from props
                getImageUrl={getImageUrl}
              />

              <p className="text-gray-400 text-xs uppercase">
                {formatDate(post.createdAt)}
              </p>
            </div>

            {/* Add Comment */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex items-center space-x-3">
              <button className="text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none"
              />
              <button className="text-blue-500 font-semibold text-sm hover:text-blue-600">
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);


  // Edit Post Modal Component
  const EditPostModal = ({ post, onClose, onSave, getImageUrl, profileData }) => {
    const [caption, setCaption] = useState(post?.caption || "");
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async () => {
      setIsUpdating(true);
      setError(null);

      try {

        const mydata = await api.get("/auth/me");

        const profileId = await api.get(`/auth/posts/${mydata.data.id}`);

        const response = await api.put(`/auth/profile/${profileId.data.profileId}/posts/${post._id}`, {
          caption: caption
        });

        if (onSave) {
          onSave(post._id, caption);
        }
        onClose();
      } catch (error) {
        console.error("Error updating post:", error);
        setError("Failed to update post. Please try again.");
      } finally {
        setIsUpdating(false);
      }
    };

    if (!post) return null;

    return (
      <div
        className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-900 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              Cancel
            </button>
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Edit Info
            </h2>
            <button
              onClick={handleSave}
              disabled={isUpdating}
              className="text-blue-500 hover:text-blue-600 font-semibold disabled:opacity-50"
            >
              {isUpdating ? 'Saving...' : 'Done'}
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col md:flex-row">
            {/* Image Preview */}
            <div className="md:w-1/2 bg-black flex items-center justify-center">
              <img
                src={getImageUrl(post.image)}
                alt="Post"
                className="w-full h-64 md:h-80 object-contain"
              />
            </div>

            {/* Edit Form */}
            <div className="md:w-1/2 p-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {profileData.profilePicture ? (
                    <img
                      src={getImageUrl(profileData.profilePicture)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
                  )}
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {profileData.username}
                </span>
              </div>

              {/* Caption Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Write a caption..."
                  className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                                         placeholder-gray-400 text-sm resize-none outline-none
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={2200}
                />
                <div className="text-right text-xs text-gray-400 mt-1">
                  {caption.length}/2,200
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
                  <p className="text-red-500 text-sm">{error}</p>
                </div>
              )}

              {/* Additional Options (optional) */}
              <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <button className="w-full text-left py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 transition flex items-center justify-between">
                  <span>Add location</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                </button>
                <button className="w-full text-left py-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg px-3 transition flex items-center justify-between">
                  <span>Tag people</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const [postData, setPostData] = useState(0);


  const [showPost, setShowPost] = useState(true);


  useEffect(() => {

    const fetchData = async () => {

      try {



        const getPostLength = await api.get(`/auth/posts/${id}`);

        const postData = getPostLength.data.postLength;


        setPostData(postData);


      }
      catch (err) {

        console.log(err);
      }

    }

    fetchData();

  }, []);

  // Handle editing a post
  const handleEditPost = (post) => {
    setEditingPost(post);
    setShowEditModal(true);
    setShowPostModal(false); // Close the detail modal
  };

  // Handle saving edited post
  const handleSaveEdit = (postId, newCaption) => {
    setPosts(prevPosts =>
      prevPosts.map(p =>
        p._id === postId
          ? { ...p, caption: newCaption }
          : p
      )
    );
    setEditingPost(null);
    setShowEditModal(false);
  };
  // Add this helper function outside or inside your component
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minutes ago`;
      }
      return `${diffHours} hours ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const [profileData, setProfileData] = useState({
    username: null,
    bio: "",
    name: "",
    gender: "",
    profilePicture: null,
    isVerified: true,
    isPrivate: false,
    posts: 248,
    followers: "125K",
    following: 892,
    isOwnProfile: true,

  });


  // Add these state variables with your other useState declarations
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersCount, setFollowersCount] = useState(0);
  const [targetProfileId, setTargetProfileId] = useState(null);
  const [followersData, setFollowersData] = useState([]);
  const [showFollowModal, setShowFollowModal] = useState(false);

  const [followingData, setFollowingData] = useState([]);
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  
  // Posts Data


  useEffect(() => {

    const fetchData = async () => {

      const followersData = await api.get(`/auth/followersData/${id}`);

      let followersCounts = followersData.data.followersData;
      let followersCounting = followersCounts.length;

      let followingCounts = followersData.data.followingDatas;
      let followingCounting = followingCounts.length;

      setFollowersData(followersData.data.followersData);
      setFollowersCount(followersCounting);
      setFollowingCount(followingCounting);


    }

    fetchData();
  }, [id]);


  useEffect(() => {

    const fetchData = async () => {

      const followersData = await api.get(`/auth/followersData/${id}`);

      setFollowingData(followersData.data.followingDatas);

    }

    fetchData();
  }, [id]);




  const [posts, setPosts] = useState([]);



  const [previewImage, setPreviewImage] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);

  const [error, setError] = useState(null);

  const [isUploading, setIsUploading] = useState(false);

  const [caption, setCaption] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);


  const fileInputRef = useRef(null);



  const [user, setUser] = useState({
    id: null,
    username: null,
    name: null
  });

  const navigate = useNavigate();




  useEffect(() => {

    const fetchData = async () => {

      const mydata = await api.get("/auth/me");

      const userId = mydata.data.id;

      const profileId = id || userId;

      const isOwnprofiles = !id || String(id) === String(userId);

      const datas = await api.get(`/auth/fullProfile/${profileId}`);



      console.log("🔵 My ID:", userId);
      console.log("🟢 URL ID:", id);
      console.log("🟡 Are they equal?", String(id) === String(userId));
      console.log("🟣 isOwnProfile:", !id || String(id) === String(userId));

      if (datas.data) {

        const userData = datas.data;

        setUser({
          id: userData._id || userData.id,
          username: userData.username

        })

        setProfileData({
          username: userData.username,
          name: userData.name,
          bio: userData.bio,
          gender: userData.gender,
          profilePicture: userData.profilePicture,
          isOwnProfile: isOwnprofiles
        })
      }
    }

    fetchData();

  }, [id, showPost]);


  useEffect(() => {
    const fetchData = async () => {
      const mydata = await api.get("/auth/me");
      const userId = mydata.data.id;
      const profileId = id || userId;
      const isOwnprofiles = !id || String(id) === String(userId);

      const datas = await api.get(`/auth/fullProfile/${profileId}`);

      if (datas.data) {
        const userData = datas.data;


        // Store the profile _id for follow API
        setTargetProfileId(id);

        setUser({
          id: userData._id || userData.id,
          username: userData.username
        });

        setProfileData({
          username: userData.username,
          name: userData.name,
          bio: userData.bio,
          gender: userData.gender,
          profilePicture: userData.profilePicture,
          isOwnProfile: isOwnprofiles
        });

        // Set followers count from followedBy array



        // Check if current user is following this profile
        if (!isOwnprofiles && userData?.followedBy) {
          const isUserFollowing = userData?.followedBy?.some(
            (followerId) => String(followerId) === String(userId)
          );
          setIsFollowing(isUserFollowing);
        }
      }
    };

    fetchData();
  }, [id, showPost]);



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
      setSelectedFile(file);

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
      setShowUploadModal(true);
    }
  };

  useEffect(() => {
    return () => {
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

  const profileEdit = () => {
    console.log('Attempting to edit profile for user id:', user.id);
    if (user.id) {
      navigate(`/editProfile/${user.id}`);
    } else {
      alert('User ID not set. Unable to edit profile.');
    }
  }

  const handleUpload = async () => {

    const formData = new FormData();

    formData.append("image", selectedFile);
    formData.append("caption", caption);

    const myposts = await api.post("/auth/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });

    setShowPost(false);

    setShowUploadModal(false);
  }


  const toggleFollow = async () => {
    try {
      if (!targetProfileId) {
        console.error("No target profile id to follow!");
        return;
      }
      const followdata = await api.post(`/auth/profile/${targetProfileId}/follow`);
      const isNowFollowing = followdata.data.follow;
      setIsFollowing(isNowFollowing);

      // ✅ Fix: Update count based on follow/unfollow action
      if (isNowFollowing) {
        setFollowersCount(prev => prev + 1);
      } else {
        setFollowersCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.log(err);
    }
  }


  useEffect(() => {

    const fetchData = async () => {

      const user = await api.get("/auth/me");

      const userData = id || user.data.id;

      const mydata = await api.get(`/auth/posts/${userData}`);

      if (mydata.data.posts) {

        setPosts(mydata.data.posts);

      }


    }

    fetchData();

  }, [id, showPost]);


  // Add this right before return
  console.log("🔶 RENDERING with isOwnProfile:", profileData.isOwnProfile);
  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-black' : 'bg-white'}`}>
      <div className="max-w-4xl mx-auto pb-16">

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setDarkMode(!darkMode)}>
              <Icons.Settings />
            </button>
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-xl text-gray-900 dark:text-white">
                {profileData.username}
              </span>
              {profileData.isVerified && <Icons.Verified />}
              <Icons.ChevronDown />
            </div>
            <Icons.Menu />
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden md:flex sticky top-0 z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-4 py-3 justify-between items-center">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-xl text-gray-900 dark:text-white">
              {profileData.username}
            </span>
            {profileData.isVerified && <Icons.Verified />}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <Icons.Settings />
            <Icons.Menu />
          </div>
        </header>

        {/* Profile Info Section */}
        <div className="px-4 py-4">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center space-x-6 mb-4">
              {/* Profile Picture */}
              <div

                className="w-20 h-20 rounded-full overflow-hidden cursor-pointer group relative"
              >
                {profileData.profilePicture ? (
                  <img
                    src={getImageUrl(profileData.profilePicture)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : ""}



              </div>

              {/* Stats */}
              <div className="flex-1 flex justify-around">
                <MobileStat value={postData} label="posts" />
                <MobileStat value={followersCount} label="followers" />
                <MobileStat value={followingCount} label="following" />

              </div>
            </div>

            {/* Name & Bio */}
            <div className="mb-4">
              <div className="flex items-center space-x-1">
                <h1 className="font-semibold text-gray-900 dark:text-white">
                  {profileData.name}
                </h1>
              </div>
              <p className="text-gray-900 dark:text-white whitespace-pre-line text-sm mt-1">
                {profileData.bio}
              </p>
              <a href={`https://${profileData.website}`} className="text-blue-900 dark:text-blue-400 font-semibold text-sm">
                {profileData.website}
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2 mb-4">
              {profileData.isOwnProfile ? (
                <>
                  <button
                    onClick={profileEdit}
                    className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg text-sm">
                    Edit profile
                  </button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg text-sm">
                    Share profile
                  </button>
                  <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-1.5 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={toggleFollow}
                    className={`flex-1 font-semibold py-1.5 px-4 rounded-lg text-sm ${isFollowing
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'bg-blue-500 text-white'
                      }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg text-sm">
                    Message
                  </button>
                  <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white p-1.5 rounded-lg">
                    <Icons.ChevronDown />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-start space-x-10 py-6">
            {/* Profile Picture */}
            <div className="w-36 h-36 rounded-full p-[3px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 flex-shrink-0">
              <div className="w-full h-full rounded-full bg-white dark:bg-black p-[3px]">
                <img
                  src={getImageUrl(profileData.profilePicture)}
                  alt={profileData.username}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </div>

            {/* Profile Details */}
            <div className="flex-1">
              {/* Username & Buttons */}
              <div className="flex items-center space-x-4 mb-5">
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl text-gray-900 dark:text-white">
                    {profileData.username}
                  </h1>
                  {profileData.isVerified && <Icons.Verified />}
                </div>

                {profileData.isOwnProfile ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={profileEdit}
                      className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      Edit profile
                    </button>
                    <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      View archive
                    </button>
                    <button className="p-1.5">
                      <Icons.Settings />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={toggleFollow}
                      className={`font-semibold py-1.5 px-6 rounded-lg text-sm transition ${isFollowing
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                      {isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-1.5 px-4 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      Message
                    </button>
                    <button className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex space-x-10 mb-5">
                <Stat value={postData} label="posts" />

                <button
                  onClick={() => setShowFollowModal(true)}
                  className="font-semibold text-gray-900 dark:text-white text-sm mb-1 hover:opacity-70 transition text-left"
                >
                  {followersCount} Followers
                </button>

                <FollowModal
                  isOpen={showFollowModal}
                  onClose={() => setShowFollowModal(false)}
                  followersData={followersData}  // This should now come from props

                />

                <button
                  onClick={() => setShowFollowingModal(true)}
                  className="font-semibold text-gray-900 dark:text-white text-sm mb-1 hover:opacity-70 transition text-left"
                >
                  {followingCount} Following
                </button>


                <FollowingModal
                  isOpen={showFollowingModal}
                  onClose={() => setShowFollowingModal(false)}
                  followingData={followingData}  // This should now come from props



                />



              </div>

              {/* Bio */}
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  {profileData.username}
                </h2>
                <p className="text-gray-900 dark:text-white whitespace-pre-line text-sm mt-1">
                  {profileData.bio}
                </p>
                <a href={`https://${profileData.website}`} className="text-blue-900 dark:text-blue-400 font-semibold text-sm hover:underline">
                  {profileData.website}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Story Highlights */}
        <div className="px-4 pb-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2">
            {profileData.isOwnProfile && (
              <StoryHighlight isNew />
            )}
            {highlights.map(highlight => (
              <StoryHighlight key={highlight.id} highlight={highlight} />
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-gray-200 dark:border-gray-800">
          <div className="flex justify-around md:justify-center md:space-x-20">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1 py-3 px-4 border-t-[1px] -mt-[1px] transition ${activeTab === tab.id
                  ? 'border-gray-900 dark:border-white text-gray-900 dark:text-white'
                  : 'border-transparent text-gray-400'
                  }`}
              >
                {tab.icon}
                <span className="hidden md:inline text-xs uppercase font-semibold tracking-wider">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-3 gap-[2px] md:gap-1">

          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}  // ✅ Use _id not id

                onClick={() => {
                  setSelectedPost(post);
                  setShowPostModal(true);
                }}
                className="relative aspect-square group cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-900"
              >
                <img
                  src={getImageUrl(post.image)}
                  alt="Post"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Image failed to load:", post.image);
                    e.target.src = 'https://via.placeholder.com/300?text=Error';
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <Icons.Heart />


                  </div>
                  <div className="flex items-center gap-1 text-white font-semibold">
                    <Icons.Comment />
                    <span>{post.comments || 0}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* Empty State */
            <div className="min-h-[50vh] flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-10 h-10 text-gray-400"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Share Photos
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">
                When you share photos, they will appear on your profile.
              </p>

              <button
                onClick={handleImageClick}
                className="text-blue-500 hover:text-blue-600 font-semibold"
              >
                Share your first photo
              </button>
            </div>
          )}


          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />


          {/* Upload Modal - NEW */}
          {showUploadModal && (


            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                {showPost ?
                  (
                    <div>
                      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700"

                      >

                        <h2 className="font-semibold text-gray-900 dark:text-white">
                          New Post
                        </h2>
                        <button
                          onClick={handleUpload}
                          disabled={isUploading}
                          className="text-blue-500 hover:text-blue-600 font-semibold disabled:opacity-50"

                        >
                          {isUploading ? 'Sharing...' : 'Share'}
                        </button>
                      </div>



                      <div className="aspect-square bg-black">
                        {previewImage && (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-contain"
                          />
                        )}

                      </div>


                      {/* Caption Input */}
                      <div className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {profileData.profilePicture ? (
                              <img
                                src={getImageUrl(profileData.profilePicture)}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-300" />
                            )}
                          </div>
                          <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Write a caption..."
                            className="flex-1 resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-400 text-sm"
                            rows={3}
                            maxLength={2200}
                          />
                        </div>
                        <div className="text-right text-xs text-gray-400 mt-2">
                          {caption.length}/2,200
                        </div>
                      </div>

                    </div>) : (<div>{showPostModal && selectedPost && (
                      <PostDetailModal
                        post={selectedPost}
                        onClose={() => {
                          setShowPostModal(false);
                          setSelectedPost(null);

                        }}
                        profileData={profileData}
                        getImageUrl={getImageUrl}
                        onEdit={handleEditPost}

                        profileId={id || user.id}
                      />

                    )}</div>)}

                {/* Error Message */}
                {error && (
                  <div className="px-4 pb-4">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>


          )}
        </div>
        {/* Floating Add Button */}
        {profileData.isOwnProfile && (
          <button
            onClick={handleImageClick}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 z-40"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="white"
              className="w-7 h-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        )}

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 px-6 py-3">
          <div className="flex justify-around items-center">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-gray-900 dark:text-white">
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-900 dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-900 dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-900 dark:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 18.996 6 18.375m-3.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25C6 11.496 5.496 12 4.875 12M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
              </svg>
            </button>
            <button className="p-2">
              <div className="w-7 h-7 rounded-full border-2 border-gray-900 dark:border-white">
                <img
                  src={profileData.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
            </button>
          </div>
        </nav>
        {/* Post Detail Modal */}
        {showPostModal && selectedPost && (
          <PostDetailModal
            post={selectedPost}
            onClose={() => {
              setShowPostModal(false);
              setSelectedPost(null);

            }}
            profileData={profileData}
            getImageUrl={getImageUrl}
            onEdit={handleEditPost}
            profileId={id || user.id}
          />

        )}

        {/* Edit Post Modal */}
        {showEditModal && editingPost && (
          <EditPostModal
            post={editingPost}
            onClose={() => {
              setShowEditModal(false);
              setEditingPost(null);
            }}
            onSave={handleSaveEdit}
            getImageUrl={getImageUrl}
            profileData={profileData}
          />
        )}
      </div>
    </div>
  );
};

export default InstagramProfile;