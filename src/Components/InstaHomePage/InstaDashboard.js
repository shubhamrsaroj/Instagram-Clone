import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../Interceptor/api';
import { IoLogOutOutline } from "react-icons/io5";

const BACKEND_URL = "http://localhost:5000";

export const InstagramDashboard = () => {

  const navigate = useNavigate();

  // Helper function to get image URL
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/600';
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
      return path;
    }
    return `${BACKEND_URL}${path}`;
  };

  // Shuffle function to randomize posts
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Format time helper
  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const [user, setuser] = useState({
    id: null,
    username: 'john_doe',
    name: 'John Doe',
    avatar: 'https://i.pravatar.cc/150?img=11',
    posts: 248,
    followers: '12.5K',
    following: 534
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);


  const [userStoriesMap, setUserStoriesMap] = useState({});
  const [viewingUserId, setViewingUserId] = useState(null);
  const [viewingUserStories, setViewingUserStories] = useState(null);

  useEffect(() => {
    const fetchdata = async () => {
      try {

        const mydatas = await api.get("/auth/me");

        const response = await api.get(`/auth/fullProfile/${mydatas.data.id}`);
        const mydata = response.data;

        console.log("✅ User data:", mydata);

        setuser(prevUser => ({
          ...prevUser,
          id: mydata.id || mydata._id,
          username: mydata.username || prevUser.username,
          name: mydata.name || mydata.fullName || prevUser.name,
          avatar: mydata.avatar || mydata.profilePicture || mydata.profileImage || prevUser.avatar,
          posts: mydata.postsCount || mydata.posts || prevUser.posts,
          followers: mydata.followersCount || mydata.followers || prevUser.followers,
          following: mydata.followingCount || mydata.following || prevUser.following,
        }));

      } catch (error) {
        console.error("❌ Error:", error);
      }
    };

    fetchdata();
  }, []);



  const [likeLoading, setLikeLoading] = useState({});
  const [commentText, setCommentText] = useState({}); // State for comment inputs

  const [showComments, setShowComments] = useState({});

  // Fetch all posts from everyone
  useEffect(() => {
    const fetchAllPosts = async () => {
      try {

      
        setLoading(true);
        const response = await api.get("/auth/everyPosts");
  
  
        if (response.data.posts) {
          // Transform and shuffle posts
          const transformedPosts = response.data.posts.map(post => ({
            id: post._id,
            username: post.postedBy?.username || 'unknown',
            userAvatar: getImageUrl(post.postedBy?.profilePicture),
            userId: post.postedBy?._id || post.postedBy?.id,
            location: post.location || '',
            image: getImageUrl(post.image),
            likes: post.likesCount || 0,
            liked: post.isLiked || false,
            saved: post.isSaved || false,
            caption: post.caption || '',
            comments: post.comments || [],
            time: formatTime(post.createdAt),
            createdAt: post.createdAt,
            profileId: post.profileId
          }));

          console.log(transformedPosts);

          // Shuffle the posts randomly
          const shuffledPosts = shuffleArray(transformedPosts);
          setPosts(shuffledPosts);
        }
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, []);

  const profileClick = () => {
    if (user.id || user._id) {
      navigate(`/profile/${user.id || user._id}`);
      console.log(user.id);
    }
  };

  // Go to other user's profile
  const goToUserProfile = (userId) => {
    if (userId) {
      navigate(`/profile/${userId}`);
      console.log(userId);
    }
  };

  const [stories, setStories] = useState([
    { id: 'my_story', username: 'Your Story', avatar: '', isYours: true, hasNew: false }
  ]);

  const [myStories, setMyStories] = useState([]);

  const fetchMyStories = async () => {

    try {
      const res = await api.get(`/auth/story/${user.id}`);

      console.log("My stories:", res.data);

      if (res.data.stories) {
        setMyStories(res.data.stories);

        setStories(prev => prev.map(s =>
          s.isYours ? { ...s, hasNew: res.data.stories.length > 0, avatar: getImageUrl(user.avatar) } : s
        ));
      }
    } catch (err) {
      console.error("Failed to fetch stories", err);
    }

  };



  useEffect(() => {
    if (user.id) {
      fetchMyStories();
    }
  }, [user.id]); // Re-fetch when user loads



  // Story Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewerModal, setShowViewerModal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const [images, setImages] = useState([]);
  const [musicFile, setMusicFile] = useState(null); // New state for music
  const [captionStory, setCaptionStory] = useState("");
  const [isPlaying, setIsPlaying] = useState(false); // Audio playback state
  const [audioRef, setAudioRef] = useState(null); // Reference to audio element
  const [suggestions] = useState([
    { id: 1, username: 'nature_shots', avatar: 'https://i.pravatar.cc/150?img=20', followedBy: 'sarah_smith' },
    { id: 2, username: 'urban_explorer', avatar: 'https://i.pravatar.cc/150?img=22', followedBy: 'mike_wilson' },
    { id: 3, username: 'art_gallery', avatar: 'https://i.pravatar.cc/150?img=28', followedBy: 'emma_jones' },
    { id: 4, username: 'music_vibes', avatar: 'https://i.pravatar.cc/150?img=35', followedBy: 'alex_brown' },
  ]);



  const handleStoryClick = (story) => {
    if (story.isYours) {
      setViewingUserId(user.id);
      setViewingUserStories(null);
      if (myStories.length > 0) {
        setShowViewerModal(true);
        setCurrentStoryIndex(0);
      } else {
        setShowUploadModal(true);
      }
    }
  };


  const nextStory = () => {
    if (currentStoryIndex < myStories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      setShowViewerModal(false); // Close if last story
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  const togglePlayPause = () => {
    if (audioRef) {
      if (isPlaying) {
        audioRef.pause();
        setIsPlaying(false);
      } else {
        audioRef.play();
        setIsPlaying(true);
      }
    }
  };



  const postStory = async () => {

    try {

      // Debug logging
      console.log("🎵 Music File:", musicFile);
      if (musicFile) {
        console.log("📊 File Size:", musicFile.size, "bytes");
        console.log("📊 File Size (MB):", (musicFile.size / (1024 * 1024)).toFixed(2), "MB");
      }

      // Validate music file size (10MB limit for Cloudinary free tier)
      if (musicFile && musicFile.size > 10 * 1024 * 1024) {
        alert(`❌ Audio file is too large (${(musicFile.size / (1024 * 1024)).toFixed(2)}MB).\n\nCloudinary's free tier has a 10MB limit for audio files.\n\nPlease:\n• Choose a shorter audio clip\n• Compress the audio file\n• Use a different song`);
        return;
      }

      const formData = new FormData();


      formData.append("captionText", captionStory);
      images.forEach((image) => {
        formData.append("image", image); // backend key name
      });

      if (musicFile) {
        formData.append("music", musicFile);
      }

      console.log("📤 Uploading story...");

      const mystory = await api.post(`/auth/stories/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("✅ Story uploaded successfully!");

      setShowUploadModal(false);
      setCaptionStory("");
      setImages([]);
      setMusicFile(null);

      fetchMyStories();

      console.log(mystory.data);
    } catch (err) {
      console.error("❌ Upload Error:", err);
      console.error("❌ Error Response:", err.response?.data);
      alert("❌ Failed to upload story. Please try again.");
    }
  };


  const handleLikeComment = async (profileId, postId, commentId) => {
    // Optimistic update
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments.map(c => {
            if (c._id === commentId) {
              return {
                ...c,
                isLiked: !c.isLiked,
                likesCount: c.isLiked ? (c.likesCount - 1) : (c.likesCount + 1)
              };
            }
            return c;
          })
        };
      }
      return post;
    }));

    try {
      const res = await api.post(`/auth/profile/${user.id}/comment/${postId}/${profileId}/${commentId}/like`);

      if (res.status === 200) {
        // Update with actual server data if needed, or rely on optimistic if simple toggle
        // The backend returns { likedBy: length }
        const newLikesCount = res.data.likedBy;

        setPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: post.comments.map(c => {
                if (c._id === commentId) {
                  return {
                    ...c,
                    likesCount: newLikesCount
                  };
                }
                return c;
              })
            };
          }
          return post;
        }));
      }
    } catch (error) {
      console.error("Like comment error", error);
      // Revert could be added here if needed, but for now focusing on removing the heavy refetch
    }
  };

  const handleLike = async (profileId, postId) => {

    if (likeLoading[postId]) return;
    //pehle liek loading khali tha 
    //ab jaise maine check kiya post id ko , to woh khali hai 
    //toh woh ye return karega ki khali hai yeh 

    //ab uske baad jayega setLikeLoading() me 

    setLikeLoading(prev => ({ ...prev, [postId]: true }));

    //{1:true}

    // Store original state for revert
    const originalPost = posts.find(post => post.id === postId);
    const wasLiked = originalPost?.liked || false;
    const originalLikes = originalPost?.likes || 0;

    // ✅ FIXED: Optimistic update with correct condition
    setPosts(prev =>
      prev.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,  // Toggle liked
            likes: post.liked    // ✅ FIXED: Check post.liked, not post.likesCount
              ? Math.max(0, post.likes - 1)
              : post.likes + 1
          };
        }
        return post;
      })
    );

    try {
      const res = await api.post(`/auth/profile/${profileId}/${postId}/like`);

      console.log("Like response:", res.data); // Debug

      // Update with server response
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
              ...post,
              liked: res.data.liked,
              likes: res.data.likesCount
            }
            : post
        )
      );
    } catch (err) {
      console.error("Like error:", err);
      // Revert to original state
      setPosts(prev =>
        prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              liked: wasLiked,
              likes: originalLikes
            };
          }
          return post;
        })
      );
    } finally {
      setLikeLoading(prev => ({ ...prev, [postId]: false }));
    }
  };
  const handleSave = async (postId) => {

    const userId = await api.get("/auth/me");

    await api.post(`auth/savedPosts/${postId}/${userId.data.id}`);

    setPosts(posts.map(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

  const handleCommentChange = (postId, text) => {
    setCommentText(prev => ({ ...prev, [postId]: text }));
  };

  const handlePostComment = async (profileId, postId) => {
    const text = commentText[postId];
    if (!text || !text.trim()) return;

    try {
      const res = await api.post(`/auth/profile/${user.id}/comment/${postId}/${profileId}`, {
        commentsText: text
      });

      if (res.status === 200) {
        setPosts(prev =>
          prev.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [
                  ...post.comments,
                  {
                    user: user.username,
                    text: text,
                    _id: res.data.commentId,
                    likesCount: 1,
                    isLiked: true
                  }
                ]
              };
            }

            console.log(res.data.commentId);
            return post;
          })
        );
        // Clear input
        setCommentText(prev => ({ ...prev, [postId]: '' }));
      }
    } catch (error) {
      console.error("❌ Error posting comment:", error);
    }
  };





  const [followers, setFollowers] = useState([]);

  // Add this new useEffect to fetch follower stories when followers are loaded
  useEffect(() => {
    const fetchFollowerStories = async () => {
      if (followers.length > 0) {
        const storiesMap = {};

        for (const follower of followers) {
          try {
            const res = await api.get(`/auth/story/${follower._id}`);
            if (res.data.stories && res.data.stories.length > 0) {
              storiesMap[follower._id] = res.data.stories;
              console.log(`✅ Stories found for ${follower.username}:`, res.data.stories);
            }
          } catch (err) {
            console.log(`No stories for ${follower.username}`);
          }
        }

        setUserStoriesMap(storiesMap);
        console.log("📱 All follower stories:", storiesMap);
      }
    };

    fetchFollowerStories();
  }, [followers]); // Run when followers change

  useEffect(() => {

    try {

      const fetchData = async () => {

        const datas = await api.get("/auth/me");

        const mydata = await api.get(`/auth/followersData/${datas.data.id}`);

        const followersData = mydata.data.followingDatas;

        setFollowers(followersData);

      }

      fetchData();

    }
    catch (err) {

      console.log(err);

    }

  }, []);



  // Styles
  const styles = {
    container: {
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      margin: 0,
      padding: 0,
    },
    header: {
      backgroundColor: '#fff',
      borderBottom: '1px solid #dbdbdb',
      padding: '12px 20px',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '975px',
      margin: '0 auto',
    },
    logo: {
      fontSize: '24px',
      fontFamily: 'cursive',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    searchBar: {
      padding: '8px 16px',
      backgroundColor: '#efefef',
      border: 'none',
      borderRadius: '8px',
      width: '250px',
      fontSize: '14px',
      outline: 'none',
    },
    navIcons: {
      display: 'flex',
      gap: '22px',
      alignItems: 'center',
    },
    navIcon: {
      fontSize: '24px',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: 0,
    },
    mainContent: {
      maxWidth: '975px',
      margin: '0 auto',
      paddingTop: '80px',
      display: 'flex',
      gap: '30px',
      padding: '80px 20px 20px',
    },
    feedSection: {
      flex: '1',
      maxWidth: '614px',
    },
    sidebarSection: {
      width: '320px',
      position: 'sticky',
      top: '80px',
      height: 'fit-content',
    },
    storiesContainer: {
      backgroundColor: '#fff',
      border: '1px solid #dbdbdb',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      display: 'flex',
      gap: '15px',
      overflowX: 'auto',
    },
    storyItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      cursor: 'pointer',
      flexShrink: 0,
    },
    storyRing: {
      padding: '3px',
      borderRadius: '50%',
      background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
    },
    storyRingNoNew: {
      padding: '3px',
      borderRadius: '50%',
      background: '#dbdbdb',
    },
    storyAvatar: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: '3px solid #fff',
      objectFit: 'cover',
    },
    storyUsername: {
      fontSize: '12px',
      marginTop: '6px',
      maxWidth: '74px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    addStory: {
      position: 'relative',
    },
    addIcon: {
      position: 'absolute',
      bottom: '0',
      right: '0',
      backgroundColor: '#0095f6',
      color: '#fff',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '16px',
      border: '2px solid #fff',
    },
    post: {
      backgroundColor: '#fff',
      border: '1px solid #dbdbdb',
      borderRadius: '8px',
      marginBottom: '24px',
    },
    postHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '14px',
      justifyContent: 'space-between',
    },
    postUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
    },
    postAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    postUsername: {
      fontWeight: '600',
      fontSize: '14px',
    },
    postLocation: {
      fontSize: '12px',
      color: '#8e8e8e',
    },
    postImage: {
      width: '100%',
      maxHeight: '600px',
      objectFit: 'contain',
      backgroundColor: '#000',
      display: 'block',
    },
    postActions: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '12px 16px',
    },
    actionButtons: {
      display: 'flex',
      gap: '16px',
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      padding: 0,
      transition: 'transform 0.2s',
    },
    likedBtn: {
      color: '#ed4956',
    },
    savedBtn: {
      color: '#262626',
    },
    postContent: {
      padding: '0 16px 16px',
    },
    likesCount: {
      fontWeight: '600',
      fontSize: '14px',
      marginBottom: '8px',
    },
    caption: {
      fontSize: '14px',
      marginBottom: '8px',
    },
    captionUsername: {
      fontWeight: '600',
      cursor: 'pointer',
    },
    viewComments: {
      color: '#8e8e8e',
      fontSize: '14px',
      cursor: 'pointer',
      marginBottom: '4px',
    },
    comment: {
      fontSize: '14px',
      marginBottom: '4px',
    },
    commentUser: {
      fontWeight: '600',
    },
    postTime: {
      fontSize: '10px',
      color: '#8e8e8e',
      textTransform: 'uppercase',
      marginTop: '8px',
    },
    addComment: {
      display: 'flex',
      padding: '12px 16px',
      borderTop: '1px solid #efefef',
      alignItems: 'center',
      gap: '12px',
    },
    commentInput: {
      flex: 1,
      border: 'none',
      outline: 'none',
      fontSize: '14px',
    },
    postBtn: {
      color: '#0095f6',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '14px',
    },
    sidebarProfile: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px',
      marginBottom: '24px',
    },
    sidebarAvatar: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    sidebarUsername: {
      fontWeight: '600',
      fontSize: '14px',
    },
    sidebarName: {
      color: '#8e8e8e',
      fontSize: '14px',
    },
    switchBtn: {
      marginLeft: 'auto',
      color: '#0095f6',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
    },
    suggestionsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '16px',
    },
    suggestionsTitle: {
      color: '#8e8e8e',
      fontWeight: '600',
      fontSize: '14px',
    },
    seeAllBtn: {
      fontWeight: '600',
      fontSize: '12px',
      cursor: 'pointer',
    },
    suggestionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '16px',
    },
    suggestionAvatar: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      objectFit: 'cover',
    },
    suggestionInfo: {
      flex: 1,
    },
    suggestionUsername: {
      fontWeight: '600',
      fontSize: '14px',
    },
    suggestionFollowed: {
      color: '#8e8e8e',
      fontSize: '12px',
    },
    followBtn: {
      color: '#0095f6',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '12px',
    },
    footer: {
      marginTop: '24px',
      fontSize: '11px',
      color: '#c7c7c7',
    },
    footerLinks: {
      marginBottom: '16px',
    },
    footerLink: {
      color: '#c7c7c7',
      textDecoration: 'none',
      marginRight: '8px',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px',
    },
    loadingSpinner: {
      width: '30px',
      height: '30px',
      border: '3px solid #dbdbdb',
      borderTop: '3px solid #262626',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite',
    },
    noPostsContainer: {
      backgroundColor: '#fff',
      border: '1px solid #dbdbdb',
      borderRadius: '8px',
      padding: '40px',
      textAlign: 'center',
    },
    noPostsIcon: {
      fontSize: '48px',
      marginBottom: '16px',
    },
    noPostsText: {
      color: '#8e8e8e',
      fontSize: '14px',
    },
    commentContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '4px',
    },
    commentContent: {
      fontSize: '14px',
      flex: 1,
      marginRight: '8px',
    },
    commentLikeBtn: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: '10px',
      padding: '0',
    },
    commentLiked: {
      // styles handled by icon
    },
    // New Modal Styles
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.85)',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadModalContent: {
      backgroundColor: '#fff',
      borderRadius: '12px',
      padding: '20px',
      width: '400px',
      maxWidth: '90%',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #dbdbdb',
      paddingBottom: '10px',
      marginBottom: '10px',
    },
    modalTitle: {
      fontWeight: '600',
      fontSize: '16px',
      textAlign: 'center',
      flex: 1,
    },
    closeBtn: {
      background: 'none',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      padding: 0,
    },
    fileInputWrapper: {
      textAlign: 'center',
      padding: '40px',
      border: '2px dashed #dbdbdb',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    captionInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #dbdbdb',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
    },
    primaryBtn: {
      backgroundColor: '#0095f6',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      padding: '8px 16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
    },
    viewerOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#1a1a1a',
      zIndex: 2000,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewerContent: {
      position: 'relative',
      height: '100%',
      width: '100%',
      maxWidth: '500px', // Mobile ratio
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    storyImageFull: {
      width: '100%',
      height: '80%',
      objectFit: 'contain',
    },
    viewerHeader: {
      position: 'absolute',
      top: '20px',
      left: '10px',
      right: '10px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 10,
    },
    viewerUser: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      color: '#fff',
    },
    progressBarContainer: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      right: '10px',
      display: 'flex',
      gap: '5px',
      zIndex: 10,
    },
    progressBarBg: {
      flex: 1,
      height: '2px',
      backgroundColor: 'rgba(255,255,255,0.3)',
      borderRadius: '2px',
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      backgroundColor: '#fff',
      // Simple animation could go here, but doing static for now
      width: '100%',
    },
    navAreaLeft: {
      position: 'absolute',
      top: '50px',
      bottom: '0',
      left: '0',
      width: '30%',
      cursor: 'pointer',
      zIndex: 5,
    },
    navAreaRight: {
      position: 'absolute',
      top: '50px',
      bottom: '0',
      right: '0',
      width: '30%',
      cursor: 'pointer',
      zIndex: 5,
    },
    musicPlayerOverlay: {
      position: 'absolute',
      bottom: '15%',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(10px)',
      padding: '12px 20px',
      borderRadius: '30px',
      zIndex: 15,
      color: '#fff',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
    },
    musicIcon: {
      fontSize: '20px',
      animation: 'pulse 1.5s ease-in-out infinite',
    },
    playPauseBtn: {
      background: 'rgba(255, 255, 255, 0.2)',
      border: 'none',
      borderRadius: '50%',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      fontSize: '16px',
      color: '#fff',
      transition: 'all 0.2s',
    },
    musicWaveform: {
      display: 'flex',
      alignItems: 'center',
      gap: '3px',
      height: '20px',
    },
    waveBar: {
      width: '3px',
      backgroundColor: '#fff',
      borderRadius: '2px',
      animation: 'wave 1s ease-in-out infinite',
    },
  };

  const logoutButton = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      {/* Add CSS for spinner animation */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
          @keyframes wave {
            0%, 100% { height: 8px; }
            50% { height: 16px; }
          }
        `}
      </style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.logo}>Instagram</div>
        <input
          type="text"
          placeholder="Search"
          style={styles.searchBar}
        />
        <nav style={styles.navIcons}>
          <button style={styles.navIcon}>🏠</button>
          <button style={styles.navIcon}>💬</button>
          <button style={styles.navIcon}>➕</button>
          <button style={styles.navIcon}>🧭</button>
          <button style={styles.navIcon}>❤️</button>
          <button onClick={logoutButton} style={styles.navIcon}> <IoLogOutOutline /></button>
          <button onClick={profileClick}>
            <img
              src={getImageUrl(user.avatar)}
              alt="Profile"
              style={{ width: '24px', height: '24px', borderRadius: '50%', cursor: 'pointer', objectFit: 'cover' }}
            />
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.mainContent}>
        {/* Feed Section */}
        <section style={styles.feedSection}>
          {/* Stories */}
          <div style={styles.storiesContainer}>
            {stories.map((story) => (
              <div key={story.id} style={styles.storyItem} onClick={() => handleStoryClick(story)}>
                <div style={story.isYours ? styles.addStory : null}>
                  <div style={story.hasNew || story.isYours ? styles.storyRing : styles.storyRingNoNew}>
                    <img
                      src={story.isYours ? getImageUrl(user.avatar) : story.avatar}
                      alt={story.username}
                      style={styles.storyAvatar}
                    />
                  </div>
                  {story.isYours && (
                    <span
                      style={styles.addIcon}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent opening viewer
                        setShowUploadModal(true);
                      }}
                    >
                      +
                    </span>
                  )}
                </div>
                <span style={styles.storyUsername}>
                  {story.isYours ? 'Your Story' : story.username}
                </span>


              </div>
            ))}

            {followers.map((follower) => {
              const hasStories = userStoriesMap[follower._id] && userStoriesMap[follower._id].length > 0;

              return (
                <div
                  key={follower._id}
                  style={styles.storyItem}
                  onClick={() => {
                    const stories = userStoriesMap[follower._id];
                    if (stories && stories.length > 0) {
                      setViewingUserId(follower._id);
                      setViewingUserStories({ user: follower, stories: stories });
                      setCurrentStoryIndex(0);
                      setShowViewerModal(true);
                    }
                  }}
                >
                  <div style={hasStories ? styles.storyRing : styles.storyRingNoNew}>
                    {follower.profilePicture ? (
                      <img
                        src={getImageUrl(follower.profilePicture)}
                        alt={follower.username}
                        style={styles.storyAvatar}
                      />
                    ) : (
                      <img
                        src={getImageUrl(user.avatar)}
                        alt={follower.username}
                        style={styles.storyAvatar}
                      />
                    )}
                  </div>
                  <span style={styles.storyUsername}>
                    {follower.username}
                  </span>
                </div>
              );
            })}

          </div>

          {/* Loading State */}
          {loading && (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
            </div>
          )}

          {/* No Posts State */}
          {!loading && posts.length === 0 && (
            <div style={styles.noPostsContainer}>
              <div style={styles.noPostsIcon}>📷</div>
              <h3>No Posts Yet</h3>
              <p style={styles.noPostsText}>When people share photos, they'll appear here.</p>
            </div>
          )}

          {/* Posts */}
          {!loading && posts.map((post) => (
            <article key={post.id} style={styles.post}>
              {/* Post Header */}
              <div style={styles.postHeader}>
                <div
                  style={styles.postUserInfo}
                  onClick={() => goToUserProfile(post.userId)}
                >
                  <img
                    src={post.userAvatar}
                    alt={post.username}
                    style={styles.postAvatar}

                  />
                  <div>
                    <div style={styles.postUsername}>{post.username}</div>
                    {post.location && (
                      <div style={styles.postLocation}>{post.location}</div>
                    )}
                  </div>
                </div>
                <button style={styles.actionBtn}>⋯</button>
              </div>

              {/* Post Image */}
              <img
                src={post.image}
                alt="Post"
                style={styles.postImage}
                onDoubleClick={() => handleLike(post.profileId, post.id)}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/600?text=Image+Not+Found';
                }}
              />

              {/* Post Actions */}
              <div style={styles.postActions}>
                <div style={styles.actionButtons}>
                  <button
                    style={{ ...styles.actionBtn, ...(post.liked ? styles.likedBtn : {}) }}
                    onClick={() => handleLike(post.profileId, post.id)}
                  >
                    {post.liked ? '❤️' : '🤍'}
                  </button>
                  <button style={styles.actionBtn}>💬</button>
                  <button style={styles.actionBtn}>📤</button>
                </div>
                <button
                  style={styles.actionBtn}
                  onClick={() => handleSave(post.id)}
                >
                  {post.saved ? '🔖' : '🏷️'}
                </button>
              </div>

              {/* Post Content */}
              <div style={styles.postContent}>
                <div style={styles.likesCount}>
                  {(post.likes || 0).toLocaleString()} likes
                </div>
                {post.caption && (
                  <div style={styles.caption}>
                    <span
                      style={styles.captionUsername}
                      onClick={() => goToUserProfile(post.userId)}
                    >
                      {post.username}
                    </span>{' '}
                    {post.caption}
                  </div>
                )}

                <button onClick={() => setShowComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))} style={styles.viewComments}> View All Comments</button>


                {

                  showComments[post.id] ? (
                    post.comments && post.comments.length > 0 && (
                      <>
                        <div style={styles.viewComments}>
                          View all {post.comments.length} comments
                        </div>

                        {post.comments.slice(0, 10).map((comment, idx) => (
                          <div key={idx} style={styles.commentContainer}>
                            <div style={styles.commentContent}>
                              <span style={styles.commentUser}>{comment.user || comment.username}</span> {comment.text || comment.content}
                            </div>
                            <button
                              style={{ ...styles.commentLikeBtn, ...(comment.isLiked ? styles.commentLiked : {}) }}
                              onClick={() => handleLikeComment(post.profileId, post.id, comment._id)}
                            >
                              {comment.isLiked ? '❤️' : '🤍'}
                              <span style={{ marginLeft: '4px' }}>{comment.likesCount}</span>
                            </button>
                          </div>
                        ))}
                      </>
                    )
                  ) : ""
                }


                <div style={styles.postTime}>{post.time}</div>
              </div>

              {/* Add Comment */}
              <div style={styles.addComment}>
                <span>😊</span>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  style={styles.commentInput}
                  value={commentText[post.id] || ''}
                  onChange={(e) => handleCommentChange(post.id, e.target.value)}
                />
                <button
                  style={styles.postBtn}
                  onClick={() => handlePostComment(post.profileId, post.id)}
                  disabled={!commentText[post.id]?.trim()}
                >
                  Post
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Sidebar */}
        <aside style={styles.sidebarSection}>
          {/* User Profile */}
          <div style={styles.sidebarProfile}>
            <img
              src={getImageUrl(user.avatar)}
              alt={user.username}
              style={styles.sidebarAvatar}
            />
            <div>
              <div style={styles.sidebarUsername}>{user.username}</div>
              <div style={styles.sidebarName}>{user.name}</div>
            </div>
            <button style={styles.switchBtn}>Switch</button>
          </div>

          {/* Suggestions */}
          <div>
            <div style={styles.suggestionsHeader}>
              <span style={styles.suggestionsTitle}>Suggestions For You</span>
              <span style={styles.seeAllBtn}>See All</span>
            </div>

            {suggestions.map((suggestion) => (
              <div key={suggestion.id} style={styles.suggestionItem}>
                <img
                  src={suggestion.avatar}
                  alt={suggestion.username}
                  style={styles.suggestionAvatar}
                />
                <div style={styles.suggestionInfo}>
                  <div style={styles.suggestionUsername}>{suggestion.username}</div>
                  <div style={styles.suggestionFollowed}>
                    Followed by {suggestion.followedBy}
                  </div>
                </div>
                <button style={styles.followBtn}>Follow</button>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.footerLinks}>
              <a href="#" style={styles.footerLink}>About</a>
              <a href="#" style={styles.footerLink}>Help</a>
              <a href="#" style={styles.footerLink}>Press</a>
              <a href="#" style={styles.footerLink}>API</a>
              <a href="#" style={styles.footerLink}>Jobs</a>
              <a href="#" style={styles.footerLink}>Privacy</a>
              <a href="#" style={styles.footerLink}>Terms</a>
            </div>
            <div>© 2024 INSTAGRAM FROM META</div>
          </div>
        </aside>
      </main>
      {/* Upload Modal */}
      {showUploadModal && (
        <div style={styles.modalOverlay} onClick={(e) => {
          if (e.target === e.currentTarget) setShowUploadModal(false)
        }}>
          <div style={styles.uploadModalContent}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Create New Story</div>
              <button style={styles.closeBtn} onClick={() => setShowUploadModal(false)}>×</button>
            </div>

            <label style={styles.fileInputWrapper}>
              <div>{images.length > 0 ? `${images.length} images selected` : "Drag photos and videos here"}</div>
              <input
                type="file"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => setImages([...e.target.files])}
              />
            </label>

            <label style={styles.fileInputWrapper}>
              <div>{musicFile ? musicFile.name : "Select a Song (Optional)"}</div>
              <input
                type="file"
                accept="audio/*"
                style={{ display: 'none' }}
                onChange={(e) => setMusicFile(e.target.files[0])}
              />
            </label>

            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '5px', overflowX: 'auto' }}>
                {/* Simple preview logic could go here */}
              </div>
            )}

            <input
              type="text"
              placeholder="Add a caption..."
              value={captionStory}
              onChange={(e) => setCaptionStory(e.target.value)}
              style={styles.captionInput}
            />

            <button style={styles.primaryBtn} onClick={postStory} disabled={images.length === 0}>
              Share to Story
            </button>
          </div>
        </div>
      )}

      {/* Story Viewer Modal */}
      {showViewerModal && (
        <div style={styles.viewerOverlay}>
          <div style={styles.viewerContent}>
            {(() => {
              // Determine which stories to show
              const isOwnStory = viewingUserId === user.id || !viewingUserStories;
              const currentStories = isOwnStory ? myStories : (viewingUserStories?.stories || []);
              const currentUser = isOwnStory ? user : viewingUserStories?.user;
              const currentStory = currentStories[currentStoryIndex];

              // If no story to show, return null
              if (!currentStory) return null;

              return (
                <>
                  {/* Header */}
                  <div style={styles.viewerHeader}>
                    <div style={styles.viewerUser}>
                      <img
                        src={getImageUrl(currentUser?.profilePicture || currentUser?.avatar)}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: '600', fontSize: '14px' }}>
                        {isOwnStory ? 'Your Story' : currentUser?.username}
                      </span>
                      <span style={{ fontSize: '12px', opacity: 0.7 }}>
                        {formatTime(currentStory.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                      {isOwnStory && (
                        <button
                          style={{ color: '#fff', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
                          onClick={() => { setShowViewerModal(false); setShowUploadModal(true); }}
                          title="Add to Story"
                        >
                          +
                        </button>
                      )}
                      <button
                        style={{ color: '#fff', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}
                        onClick={() => {
                          setShowViewerModal(false);
                          setViewingUserId(null);
                          setViewingUserStories(null);
                          if (audioRef) {
                            audioRef.pause();
                            setIsPlaying(false);
                          }
                        }}
                      >
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={styles.progressBarContainer}>
                    {currentStories.map((_, idx) => (
                      <div key={idx} style={styles.progressBarBg}>
                        <div style={{
                          ...styles.progressBarFill,
                          width: idx <= currentStoryIndex ? '100%' : '0%'
                        }}></div>
                      </div>
                    ))}
                  </div>

                  {/* Main Image */}
                  {currentStory.image && (
                    <img
                      src={getImageUrl(Array.isArray(currentStory.image) ? currentStory.image[0] : currentStory.image)}
                      style={styles.storyImageFull}
                      alt="Story"
                    />
                  )}

                  {/* Caption Overlay */}
                  {currentStory.storyCaption && (
                    <div style={{
                      position: 'absolute',
                      bottom: '10%',
                      left: '0',
                      right: '0',
                      textAlign: 'center',
                      color: '#fff',
                      padding: '20px',
                      textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                    }}>
                      {currentStory.storyCaption}
                    </div>
                  )}

                  {/* Audio Player */}
                  {currentStory.music && (
                    <>
                      <audio
                        ref={(el) => {
                          setAudioRef(el);
                          if (el) {
                            el.onplay = () => setIsPlaying(true);
                            el.onpause = () => setIsPlaying(false);
                          }
                        }}
                        src={getImageUrl(currentStory.music)}
                        autoPlay
                        loop
                        style={{ display: 'none' }}
                        onError={(e) => console.log("Audio play failed", e)}
                      />

                      <div style={styles.musicPlayerOverlay}>
                        <span style={styles.musicIcon}>🎵</span>
                        {isPlaying && (
                          <div style={styles.musicWaveform}>
                            <div style={{ ...styles.waveBar, animationDelay: '0s' }}></div>
                            <div style={{ ...styles.waveBar, animationDelay: '0.2s' }}></div>
                            <div style={{ ...styles.waveBar, animationDelay: '0.4s' }}></div>
                            <div style={{ ...styles.waveBar, animationDelay: '0.1s' }}></div>
                            <div style={{ ...styles.waveBar, animationDelay: '0.3s' }}></div>
                          </div>
                        )}
                        <button
                          style={styles.playPauseBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlayPause();
                          }}
                          onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                          onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                          {isPlaying ? '⏸' : '▶'}
                        </button>
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>Music</span>
                      </div>
                    </>
                  )}

                  {/* Navigation Click Areas */}
                  <div
                    style={styles.navAreaLeft}
                    onClick={() => {
                      if (currentStoryIndex > 0) {
                        setCurrentStoryIndex(prev => prev - 1);
                      }
                    }}
                  ></div>
                  <div
                    style={styles.navAreaRight}
                    onClick={() => {
                      if (currentStoryIndex < currentStories.length - 1) {
                        setCurrentStoryIndex(prev => prev + 1);
                      } else {
                        setShowViewerModal(false);
                        setViewingUserId(null);
                        setViewingUserStories(null);
                        if (audioRef) {
                          audioRef.pause();
                          setIsPlaying(false);
                        }
                      }
                    }}
                  ></div>
                </>
              );
            })()}
          </div>
        </div>
      )}

    </div>
  );
};

export default InstagramDashboard;