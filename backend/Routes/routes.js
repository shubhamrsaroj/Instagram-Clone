import Users from "../UsersDatabase/Users/users.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Nodemailer/nodemailer.js";
import Profile from "../UsersDatabase/profile.js";
import { protect } from "../Auth/jwt_auth.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
import { format } from "path";
import { profile } from "console";

dotenv.config();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
});


const routers = express.Router();

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const ext = file.originalname.split('.').pop().toLowerCase();
        const isAudioOrVideo = file.mimetype.startsWith('audio') || file.mimetype.startsWith('video') || ['mp3', 'wav', 'm4a'].includes(ext);

        console.log(`☁️ Cloudinary: File=${file.originalname} Mime=${file.mimetype} DetectedAs=${isAudioOrVideo ? 'video' : 'image'}`);

        if (isAudioOrVideo) {
            return {
                folder: "instagram_clone",
                resource_type: "video"
            };
        } else {
            return {
                folder: "instagram_clone",
                allowed_formats: ["jpg", "png", "jpeg", "webp"],
                resource_type: "image"
            };
        }
    },

});




const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

console.log("✅ Multer Config Loaded with 100MB Limit");

routers.post("/register", async (req, res) => {

    try {

        const { username, email, password } = req.body;

        const findit = await Users.findOne({ email: email });

        if (findit) {

            return res.status(400).json({ message: "User already Exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // await sendEmail(email,`Your otp is ${otp}`);

        const mydata = new Users({ username, email, password: hashedPassword });

        const profile = await Profile.create({
            user: mydata._id,
            name: "",
            bio: "",
            phoneNo: "",
            profilePicture: "",
            posts: [],
        });



        // Save profile reference to user
        mydata.profile = profile._id;


        await mydata.save();

        const token = jwt.sign({ _id: mydata.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        return res.status(200).json({ message: "Sucessfully registered", token });

    }
    catch (err) {

        console.log(err);

    }

});

routers.post("/verifyOtp", async (req, res) => {

    const { email, otp } = req.body;

    const person = await Users.findOne({ email });

    if (person.otp !== otp) {

        return res.status(400).json({ message: "Invalid otp" });

    }
    return res.status(200).json({ message: "Verified Successfully" });

});


routers.post("/login", async (req, res) => {

    const { email, password } = req.body;

    const users = await Users.findOne({ email });

    if (!users) {

        return res.status(400).json({ message: "User not found" });

    }

    const match = await bcrypt.compare(password, users.password);

    const token = jwt.sign({ _id: users._id }, process.env.JWT_SECRET, { expiresIn: "60h" });

    if (!match) {

        return res.status(400).json({ message: "Password is invalid" });

    }

    return res.status(200).json({ message: "Login Successfully", token });

});


routers.get("/me", protect, async (req, res) => {

    try {

        res.json({

            id: req.user._id,
            username: req.user.username,
            email: req.user.email

        });

    }
    catch (err) {

        console.log(err);

    }
});

routers.get("/fullProfile/:userId", protect, async (req, res) => {

    const users = req.params.userId;

    const userIds = await Users.findById(users);

    const profile = await Profile.findOne({ user: userIds._id });

    return res.json({
        id: userIds._id,
        _id: userIds._id, // always include _id for compatibility
        name: profile.name,
        username: userIds.username,
        email: userIds.email,
        profilePicture: profile.profilePicture || "",
        bio: profile.bio || "",
        gender: profile.gender || "",
        phoneNo: profile.phoneNo || "",
        followedBy: profile.followedBy,
        follow: profile.follow,
        following: profile.following
    });
}
);


routers.put("/profile", upload.single("profilePicture"), protect, async (req, res) => {

    let { name, profilePicture, bio, gender, phoneNo, username } = req.body;


    profilePicture = req.file ? req.file.path : "";

    await Users.findByIdAndUpdate(req.user._id, { username });

    let profile = await Profile.findOne({ user: req.user._id });


    if (profile) {


        profile.name = name || profile.name;
        profile.profilePicture = profilePicture || profile.profilePicture;
        profile.bio = bio || profile.bio;
        profile.gender = gender || profile.gender;
        profile.phoneNo = phoneNo || profile.phoneNo;


        await profile.save();

        return res.status(200).json({ message: "Profile Updated Succesfully", profile });


    }
    else {

        const newprofile = new Profile({
            user: req.user._id,
            name,
            profilePicture,
            bio,
            gender,
            phoneNo
        });

        await newprofile.save();

        return res.status(200).json({ message: "New Profile", profile: newprofile });

    }
});

const uploadImage = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            console.error("UPLOAD ERROR (Multer/Cloudinary):", err);
            return res.status(500).json({ message: "Image upload failed", error: err.message });
        }
        next();
    });
};

routers.post("/posts", protect, uploadImage, async (req, res) => {

    let profileData = await Profile.findOne({ user: req.user._id });

    if (!req.file) {
        console.error("No file uploaded or Multer failed.");
        return res.status(400).json({ message: "No image file provided" });
    }
    const myPost = req.file.path;

    const posts = {

        image: myPost,
        caption: req.body.caption || "",
        likes: 0,
        likedBy: [],
        comments: [],
        createdAt: new Date()
    };


    profileData.posts.unshift(posts);
    await profileData.save();

    return res.status(200).json({ message: "Uploaded Succesfully", profileData });

});

routers.get("/posts/:userId", protect, async (req, res) => {

    const { userId } = req.params;

    const postData = await Profile.findOne({ user: userId });

    const postLength = postData.posts.length;

    console.log(postData);

    return res.status(200).json({ message: "fetched succesfully", posts: postData.posts, profileId: postData._id, postLength: postLength });

});

routers.put("/profile/:profileId/posts/:postsId/", async (req, res) => {

    const { profileId, postsId } = req.params;

    const { caption } = req.body;
    const { likes } = req.body;


    const updatedCaption = await Profile.findOneAndUpdate(

        { _id: profileId, "posts._id": postsId },
        { $set: { "posts.$.caption": caption, "posts.$.likes": likes } },
        { new: true }

    );
    return res.status(200).json({ message: "Caption Update", captionUpdate: updatedCaption });

    //{ $set: { "arrayName.$.fieldName": value } }

});


//ek cheej samjho ki jab
//maine post open kiya toh
//uske andar , url me postId nahi hai 
//toh kaha se wo data dikhega jaise wo caption dikhe hai 
//waise like bhi dikhega 

routers.post("/profile/:profileId/:postId/like", protect, async (req, res) => {

    const { profileId, postId } = req.params;

    const userId = req.user._id;

    const profile = await Profile.findById(profileId);

    const post = profile.posts.id(postId);


    //[{
    //userId:""
    //image:""
    //likedBy:" " in this objct id will be there 
    //}]
    //so first we have taken profile id and post id then we are searching for the postId ,through this see upper side

    if (!post.likedBy) {
        post.likedBy = []
    }

    const alreadyLiked = post.likedBy.some(id => String(id) === String(userId));

    if (alreadyLiked) {
        post.likedBy = post.likedBy.filter(id => String(id) !== String(userId));
    }
    else {
        post.likedBy.push(userId);
    }

    const updatedLikesCount = post.likedBy ? post.likedBy.length : 0;

    console.log(updatedLikesCount);

    await profile.save();

    return res.status(200).json({
        message: "successfully liked",
        liked: !alreadyLiked,
        likesCount: updatedLikesCount
    });

});

routers.get("/profileId/:profileId/postsData/:postId", protect, async (req, res) => {

    const { postId, profileId } = req.params;

    const myProfileData = await Profile.findOne({ user: profileId }).populate({
        path: "posts.likedBy",
        select: "username"
    });

    console.log(myProfileData);

    const postsData = myProfileData.posts.id(postId);

    const likedUsers = postsData.likedBy.map((user) => ({
        username: user.username,
        _id: user._id
    }));


    console.log(likedUsers);

    const likedCount = postsData.likedBy ? postsData.likedBy.length : 0;

    return res.status(200).json({
        likedCount: likedCount,
        likedUsers: likedUsers
    });

});

//one thing i can do 
//

routers.get("/followersData/:profileId", protect, async (req, res) => {

    const { profileId } = req.params;

    const profile = await Profile.findOne({ user: profileId }).populate({
        path: "followedBy",
        select: "username",
        populate: {
            path: "profile",
            select: "profilePicture"
        }
    });


    const followingData = await Profile.findOne({ user: profileId }).populate({
        path: "following",
        select: "username",
        populate: {
            path: "profile",
            select: "profilePicture"
        }
    });


    const followersData = profile.followedBy.map((user) =>
    ({
        _id: user._id,
        username: user.username,
        profilePicture: user.profile?.profilePicture
    }
    ));

    console.log(followersData.length);
    console.log(followingData.length);

    const followingDatas = followingData.following.map((user) => ({

        _id: user._id,
        username: user.username,
        profilePicture: user.profile?.profilePicture


    }));

    console.log(followingDatas);

    return res.status(200).json({ followersData: followersData, followingDatas: followingDatas });

});


routers.delete("/profile/:profileId/posts/:postsId", async (req, res) => {

    try {
        const { profileId, postsId } = req.params;

        await Profile.findByIdAndUpdate(

            profileId,

            { $pull: { posts: { _id: postsId } } },
            { new: true }

        );
        //$pull: { arrayName: { key: value } }
        return res.status(200).json({ message: "posts deleted successfully" });

    }
    catch (err) {
        console.log(err);
    }
});

//sabse pehle mai ye check karunga ki  current user ka id lunga
//uska baad mai populate aur select karunga user , ko uske andar user aur username 
//jaise profile ke andar posts profilePicture user hai ,
//uske baad flatMap use karunga , jiske wajah se combine hojayega 
//posts aur profile 

routers.get("/everyPosts", protect, async (req, res) => {  // ✅ Added protect
    try {
        const currentUserId = req.user._id;  // ✅ Get current user

        const currentUserProfile = await Profile.findOne({user:currentUserId});


        const savedPostsIdSet = new Set((currentUserProfile?.savedPosts || []).map(sp =>sp.postId?.toString()).filter(Boolean));


        const profiles = await Profile.find({})
            .populate("user", "username email")
            .populate("posts.comments.commentedBy posts.comments.likedBy", "username") // ✅ Populate comment authors
            .select("posts user profilePicture");

    

        const allPosts = profiles.flatMap(profile =>
            profile.posts.map(post => {
                const postObj = post.toObject();

                // ✅ Check if CURRENT USER liked this post
                const isLiked = post.likedBy?.some(
                    (id) => id.toString() === currentUserId.toString()
                ) || false;



                // ✅ Calculate likes count properly
                const likesCount = post.likedBy?.length || 0;

                const isSaved = savedPostsIdSet.has(post._id.toString());

                return {
                    ...postObj,
                    isLiked: isLiked,    
                    isSaved:isSaved,       // ✅ Current user's like status
                    likesCount: likesCount,     // ✅ Use consistent naming
                    postedBy: {
                        _id: profile.user._id,
                        username: profile.user.username,
                        email: profile.user.email,
                        profilePicture: profile.profilePicture
                    },
                    profileId: profile._id,


                    comments: post.comments.map(comment => ({
                        _id: comment._id,
                        text: comment.text,
                        user: comment.commentedBy?.username || "Unknown", // ✅ Map username
                        createdAt: comment.createdAt,
                        likesCount: comment.likedBy?.length || 0,
                        
                        isLiked: comment.likedBy?.some(id => id.toString() === currentUserId.toString()) || false,
                        likedComment: comment.likedBy?._id
                    }))
                };
            })
        );

        return res.status(200).json({
            message: "All posts fetched",
            posts: allPosts
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server error" });
    }
});

routers.post("/profile/:userId/follow", protect, async (req, res) => {

    const { userId } = req.params;

    const profile = await Profile.findOne({ user: userId });

    const currentUsersId = req.user._id;

    const myprofile = await Profile.findOne({ user: currentUsersId });

    if (!profile.followedBy) {
        profile.followedBy = [];
    }

    if (!myprofile.following) {
        myprofile.following = [];
    }

    const currentUserId = req.user._id;
    const alreadyFollowed = profile.followedBy.some(id => String(id) === String(currentUserId));

    const alreadyFollowing = myprofile.following.some((id) => String(id) === String(userId));
    if (alreadyFollowed) {
        profile.followedBy = profile.followedBy.filter(id => String(id) !== String(currentUserId));
    } else {
        profile.followedBy.push(currentUserId);
    }

    if (alreadyFollowing) {
        myprofile.following = myprofile.following.filter((id) => String(id) !== String(userId));
    }
    else {
        myprofile.following.push(userId);
    }


    await profile.save();
    await myprofile.save();

    return res.status(200).json({
        follow: !alreadyFollowed,
        followedBy: profile.followedBy.length,
        following: myprofile.following.length

    });

    //dekho maine backend me profile ka id bheja jise mai follow karne jaa raha hu 
    //to backend me maine bheja , phir mai ye check kar raha hu 
    // ki , mera userID uss , profileID ke followed by me hai ki nahi 
    //agar hoga 
    //to koi bat nahi 
    //nahi toh mai add kar dunga 
});


routers.post("/profile/:userId/comment/:postsId/:profileId", protect, async (req, res) => {

    const userId = req.user._id;

    const { commentsText } = req.body;

    const { postsId, profileId } = req.params;

    const profile = await Profile.findById(profileId);

    const postsData = profile.posts.id(postsId);

    postsData.comments.push({
        commentedBy: userId,
        text: commentsText,
        likedBy: userId
    });

    await profile.save();

    console.log(postsData.comments[postsData.comments.length - 1]._id);

    return res.status(200).json({ comments: commentsText, postsId: postsId, userId: userId, commentId: postsData.comments[postsData.comments.length - 1]._id });

});

routers.post("/profile/:userId/comment/:postsId/:profileId/:commentId/like", protect, async (req, res) => {

    const userId = req.user._id;

    const { postsId, profileId, commentId } = req.params;

    const profile = await Profile.findById(profileId);

    const postsData = profile.posts.id(postsId);

    const commentData = postsData.comments.id(commentId);

    const alreadyLiked = commentData.likedBy.some(id => String(id) === String(userId));

    if (alreadyLiked) {
        commentData.likedBy = commentData.likedBy.filter(id => String(id) !== String(userId));
    } else {
        commentData.likedBy.push(userId);
    }
    await profile.save();
    return res.status(200).json({ likedBy: commentData.likedBy?.length });

});


routers.post("/stories/:userId", protect, (req, res, next) => {

    const uploadMiddleware = upload.fields([{ name: 'image', maxCount: 10 }, { name: 'music', maxCount: 1 }]);
    uploadMiddleware(req, res, (err) => {
        if (err) {
            console.error("Cloudinary/Multer Upload Error:", err);
            return res.status(400).json({ message: "File upload failed", error: err.message || err });
        }
        next();
    });

},

    async (req, res) => {

        try {

            const { userId } = req.params;
            let { captionText } = req.body;

            // Handle images
            let images = [];
            if (req.files && req.files['image']) {
                images = req.files['image'].map(file => file.path);
            }


            // Handle music
            let music = "";
            if (req.files && req.files['music']) {
                music = req.files['music'][0].path;
            }


            const profile = await Profile.findOne({ user: userId });

            if (!profile) {
                return res.status(404).json({ message: "Profile not found" });
            }

            const newStory = {

                image: images,
                storyCaption: captionText,
                music: music

            };

            if (!profile.stories) {
                profile.stories = [];
            }

            profile.stories.unshift(newStory);

            await profile.save();

            return res.status(200).json({ message: "Successfully posted Story" });

        } catch (err) {
            console.error("Story Route Error:", err);
            return res.status(500).json({ message: "Internal server error", error: err.message });
        }

    });

routers.get("/story/:userId", protect, async (req, res) => {

    const { userId } = req.params;

    const myprofile = await Profile.findOne({ user: userId });

    return res.status(200).json({ stories: myprofile.stories });

});

routers.delete("/stories/:storiesId", protect, async (req, res) => {

    const userId = req.user._id;

    const { storiesId } = req.params;

    const myprofile = await Profile.findOne({ user: userId });

    await Profile.findByIdAndUpdate(

        myprofile._id,
        { $pull: { stories: { _id: storiesId } } },
        { new: true }

    );

    return res.status(200).json({ message: "Deleted stories successfully" });

});

routers.post("/savedPosts/:postsId/:userId",protect, async (req, res) => {


    const { postsId, userId } = req.params;

    const profile = await Profile.findOne({ user: userId });


    if (!profile.savedPosts) {
        profile.savedPosts = [];
    }

    const alreadySaved = profile.savedPosts.some((item) => String(item.postId) === String(postsId));

    if (alreadySaved) {
        profile.savedPosts = profile.savedPosts.filter((item) => String(item.postId) !== String(postsId));
    }
    else {
        profile.savedPosts.push({ postId: postsId, ownerId: userId });
    }

    await profile.save();

    return res.status(200).json({ message: "succesfully saved" });

});



export default routers;




