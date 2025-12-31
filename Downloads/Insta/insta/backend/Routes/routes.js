import Users from "../UsersDatabase/Users/users.js";
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendEmail } from "../Nodemailer/nodemailer.js";
import Profile from "../UsersDatabase/profile.js";
import { protect } from "../Auth/jwt_auth.js";
import multer from "multer";
import profile from "../UsersDatabase/profile.js";
import { stringify } from "uuid";


const routers =express.Router();



const storage= multer.diskStorage({
   
    destination:function(req,file,cb){
      
        cb(null,"uploads")

    },
    
    filename:function(req,file,cb){
         cb(null,Date.now()+"-"+file.originalname);
    }

});

const upload= multer({storage});


routers.post("/register",async(req,res)=>{
    
    try{

        const {username,email,password} =req.body;

        const findit = await Users.findOne({email:email});

        if(findit){
           
            return res.status(400).json({message:"User already Exists"});
        }

        const hashedPassword =await bcrypt.hash(password,10);

        //const otp = Math.floor(100000 + Math.random() * 900000).toString();
         
       // await sendEmail(email,`Your otp is ${otp}`);
         
        const mydata= new Users({username,email,password:hashedPassword});

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
       
        const token = jwt.sign({_id:mydata.id},process.env.JWT_SECRET,{expiresIn:"1h"}); 
        
        return res.status(200).json({message:"Sucessfully registered",token});

    }
    catch(err){

        console.log(err);

    }
    
});

routers.post("/verifyOtp",async(req,res)=>{
    
    const {email,otp} =req.body;

    const person = await Users.findOne({email});

    if(person.otp!== otp){

        return res.status(400).json({message:"Invalid otp"});

    }
    return res.status(200).json({message:"Verified Successfully"});

});


routers.post("/login",async(req,res)=>{
    
    const {email,password} =req.body;

    const users = await Users.findOne({email});

    if(!users){

         return res.status(400).json({message:"User not found"});

    }

    const match = await bcrypt.compare(password,users.password);

    const token =jwt.sign({_id:users._id},process.env.JWT_SECRET,{expiresIn:"60h"});

    if(!match){
        
        return res.status(400).json({message:"Password is invalid"});

    }

    return res.status(200).json({message:"Login Successfully",token});
    
});


routers.get("/me",protect,async(req,res)=>{

    try{
       
        res.json({
          
            id:req.user._id,
            username:req.user.username,
            email:req.user.email

        });

    }
    catch(err){
        
        console.log(err);

    }
});

routers.get("/fullProfile/:userId",protect,async(req,res)=>{

    const users = req.params.userId;

    const userIds = await Users.findById(users);

    const profile =await Profile.findOne({user:userIds._id});

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
            followedBy:profile.followedBy,
            follow:profile.follow
    });
}
);


routers.put("/profile",upload.single("profilePicture"),protect,async(req,res)=>{
    
    let { name,profilePicture, bio, gender, phoneNo, username} =req.body;

    
    profilePicture =req.file ? `/uploads/${req.file.filename}`:""; 

    await Users.findByIdAndUpdate(req.user._id,{username});

    let profile = await Profile.findOne({user:req.user._id});


    if(profile){

             
             profile.name= name || profile.name;
             profile.profilePicture = profilePicture || profile.profilePicture;
            profile.bio = bio || profile.bio;
            profile.gender = gender || profile.gender;
            profile.phoneNo = phoneNo || profile.phoneNo;


    await profile.save();

    return res.status(200).json({message:"Profile Updated Succesfully",profile});


    }
    else{
        
        const newprofile =new Profile({
            user: req.user._id,
                name,
                profilePicture,
                bio,
                gender,
                phoneNo
        });

        await newprofile.save();

        return res.status(200).json({message:"New Profile",profile:newprofile});

    }
    });
     
routers.post("/posts",protect,upload.single("image"),async(req,res)=>{

    let profileData = await Profile.findOne({user:req.user._id});
    
    const myPost =`/uploads/${req.file.filename}`;

    const posts={
      
        image:myPost,
        caption:req.body.caption || "",
        likes:0,
        likedBy:[],
        comments:0,
        createdAt:new Date()

    };
    
    profileData.posts.unshift(posts);
    


    await profileData.save();
    
    return res.status(200).json({message:"Uploaded Succesfully",profileData});

});    

routers.get("/posts/:userId",protect,async(req,res)=>{


    const users = req.params.userId;

    const userIds = await Users.findById(users); 
    

    const postData = await Profile.findOne({user:userIds._id});

    console.log(postData);

    return res.status(200).json({message:"fetched succesfully",posts:postData.posts,profileId:postData._id});

});

routers.put("/profile/:profileId/posts/:postsId/",async(req,res)=>{

    const {profileId,postsId} =req.params;

    const {caption}=req.body;
    const {likes} =req.body;


    const updatedCaption =await Profile.findOneAndUpdate(
         {_id:profileId,"posts._id":postsId},
         {$set :{"posts.$.caption":caption,"posts.$.likes":likes}},
         
         {new:true}

    );


    return res.status(200).json({message:"Caption Update",captionUpdate:updatedCaption});

      //{ $set: { "arrayName.$.fieldName": value } }

});

routers.post("/profile/:profileId/:postId/like",protect,async(req,res)=>{
    
    const {profileId,postId} =req.params;

    const userId = req.user._id;

    const profile = await Profile.findById(profileId);
    
    const post = profile.posts.id(postId);

    
    //[{
       //userId:""
       //image:""
       //likedBy:" " in this obejct id will be there 
    //}]
    //so first we have taken profile id and post id then we are searching for the postId ,through this see upper side

    if(!post.likedBy){
        post.likedBy=[]
    }

    const alreadyLiked = post.likedBy.some(id => String(id) === String(userId));

    if(alreadyLiked){
        post.likedBy= post.likedBy.filter(id =>String(id) !== String(userId));
    }
    else{
        post.likedBy.push(userId);  
    }
    
    const updatedLikesCount = post.likedBy ? post.likedBy.length : 0;

    console.log(updatedLikesCount);

     await profile.save();

    return res.status(200).json({
        message:"successfully liked",
        liked: !alreadyLiked,
        likesCount: updatedLikesCount
    });

});

routers.delete("/profile/:profileId/posts/:postsId",async(req,res)=>{

    try{
    const {profileId,postsId} =req.params;

    await Profile.findByIdAndUpdate(
      
        profileId,

        { $pull :{posts:{_id:postsId}}},
        {new:true}

    );

    //$pull: { arrayName: { key: value } }
    return res.status(200).json({message:"posts deleted successfully"});
}
    catch(err){
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
        
        const profiles = await Profile.find({})
            .populate("user", "username email")
            .select("posts user profilePicture ");

        const allPosts = profiles.flatMap(profile =>
            profile.posts.map(post => {
                const postObj = post.toObject();
                
                // ✅ Check if CURRENT USER liked this post
                const isLiked = post.likedBy?.some(
                    (id) => id.toString() === currentUserId.toString()
                ) || false;
                


                // ✅ Calculate likes count properly
                const likesCount = post.likedBy?.length || 0;
                
                return {
                    ...postObj,
                    isLiked: isLiked,           // ✅ Current user's like status
                    likesCount: likesCount,     // ✅ Use consistent naming
                    postedBy: {
                        _id: profile.user._id,
                        username: profile.user.username,
                        email: profile.user.email,
                        profilePicture: profile.profilePicture
                    },
                    profileId: profile._id
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

routers.post("/profile/:userId/follow",protect,async(req,res)=>{

    const {userId} = req.params;

    const profile = await Profile.findOne({ user:userId });

    if (!profile.followedBy) {
        profile.followedBy = [];
    }

    const currentUserId = req.user._id;
    const alreadyFollowed = profile.followedBy.some(id => String(id) === String(currentUserId));

    if (alreadyFollowed) {
        profile.followedBy = profile.followedBy.filter(id => String(id) !== String(currentUserId));
    } else {
        profile.followedBy.push(currentUserId);
    }

    const followers = profile.followedBy ? profile.followedBy.length : 0;

    await profile.save();

    return res.status(200).json({
        follow: !alreadyFollowed,
        followedBy: followers
    });

    //dekho maine backend me profile ka id bheja jise mai follow karne jaa raha hu 
    //to backend me maine bheja , phir mai ye check kar raha hu 
    // ki , mera userID uss , profileID ke followed by me hai ki nahi 
    //agar hoga 
    //to koi bat nahi 
    //nahi toh mai add kar dunga 
    

});

export default routers;


