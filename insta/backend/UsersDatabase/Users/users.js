import mongoose from "mongoose";

const Users = new mongoose.Schema({

    username:{
        type:String
    },

    email:{
        type:String
    },
    password:{
        type:String
    },
    otp:{
        type:String
    },

    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    }

});


export default mongoose.model("Users",Users);






