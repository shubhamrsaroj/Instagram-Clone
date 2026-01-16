import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
            saved: false,
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

  const [stories] = useState([
    { id: 1, username: 'your_story', avatar: 'https://i.pravatar.cc/150?img=11', isYours: true },
    { id: 2, username: 'sarah_smith', avatar: 'https://i.pravatar.cc/150?img=5', hasNew: true },
    { id: 3, username: 'mike_wilson', avatar: 'https://i.pravatar.cc/150?img=12', hasNew: true },
    { id: 4, username: 'emma_jones', avatar: 'https://i.pravatar.cc/150?img=9', hasNew: true },
    { id: 5, username: 'alex_brown', avatar: 'https://i.pravatar.cc/150?img=15', hasNew: false },
    { id: 6, username: 'lisa_davis', avatar: 'https://i.pravatar.cc/150?img=25', hasNew: true },
    { id: 7, username: 'chris_lee', avatar: 'https://i.pravatar.cc/150?img=33', hasNew: false },
  ]);

  const [suggestions] = useState([
    { id: 1, username: 'nature_shots', avatar: 'https://i.pravatar.cc/150?img=20', followedBy: 'sarah_smith' },
    { id: 2, username: 'urban_explorer', avatar: 'https://i.pravatar.cc/150?img=22', followedBy: 'mike_wilson' },
    { id: 3, username: 'art_gallery', avatar: 'https://i.pravatar.cc/150?img=28', followedBy: 'emma_jones' },
    { id: 4, username: 'music_vibes', avatar: 'https://i.pravatar.cc/150?img=35', followedBy: 'alex_brown' },
  ]);



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
  const handleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

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
              <div key={story.id} style={styles.storyItem}>
                <div style={story.isYours ? styles.addStory : null}>
                  <div style={story.hasNew || story.isYours ? styles.storyRing : styles.storyRingNoNew}>
                    <img
                      src={getImageUrl(user.avatar)}
                      alt={story.username}
                      style={styles.storyAvatar}
                    />
                  </div>
                  {story.isYours && <span style={styles.addIcon}>+</span>}
                </div>
                <span style={styles.storyUsername}>
                  {story.isYours ? 'Your Story' : story.username}
                </span>
              </div>
            ))}
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
                {post.comments && post.comments.length > 0 && (
                  <>
                    <div style={styles.viewComments}>
                      View all {post.comments.length} comments
                    </div>
                    {post.comments.slice(0, 2).map((comment, idx) => (
                      <div key={idx} style={styles.comment}>
                        <span style={styles.commentUser}>{comment.user || comment.username}</span> {comment.text || comment.content}
                      </div>
                    ))}
                  </>
                )}
                <div style={styles.postTime}>{post.time}</div>
              </div>

              {/* Add Comment */}
              <div style={styles.addComment}>
                <span>😊</span>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  style={styles.commentInput}
                />
                <button style={styles.postBtn}>Post</button>
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
    </div>
  );
};

export default InstagramDashboard;