import mongoose from "mongoose";

const Profile = new mongoose.Schema({

    user:{
         type:mongoose.Schema.Types.ObjectId,
         ref:"Users",
         required:true
    },
    name:{
        type:String
    },
    bio:{
        type:String,
        trim:true,
       maxLength:300
    },
    gender:{
        type:String,
        enum:["male","female"],
        default:"male"
    },

    phoneNo:{
        type:String
    },
    profilePicture:{
        type:String
    },

    followedBy:[{
           type:mongoose.Schema.Types.ObjectId,
           ref:"Users"
        }],

        following:[{
             
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users"
        }],

        follow:{
            
            type:Number,
            default:0
        },

    posts:[{
       
        image:{
            type:String
        },
        caption:{
            type:String,
            default:""
        },
        likes:{
            type:Number,
            default:0
        },
         likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }],
        
        comments:{
            type:Number,
            default:0
        },
        createdAt:{
            type:String,
            default:Date.now()
        }
        
    }]
    
});

export default mongoose.model("Profile",Profile);