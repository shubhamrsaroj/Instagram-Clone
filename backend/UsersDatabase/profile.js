import mongoose from "mongoose";

const Profile = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    name: {
        type: String
    },
    bio: {
        type: String,
        trim: true,
        maxLength: 300
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        default: "male"
    },

    phoneNo: {
        type: String
    },

    profilePicture: {
        type: String
    },

    followedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],

    following: [{

        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],

    follow: {

        type: Number,
        default: 0
    },

    posts: [{

        image: {
            type: String
        },
        caption: {
            type: String,
            default: ""
        },
        likes: {
            type: Number,
            default: 0
        },
        likedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }],

        comments: [{

            text: {
                type: String,
                default: null
            },

            commentedBy:
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            }
            ,

            likedBy: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: "Users"
            }],

            createdAt: {
                type: Date,
                default: Date.now
            }

        }],

        createdAt: {
            type: String,
            default: Date.now()
        },



    }],

    stories: [{
        image: {
            type: [String]
        },
        storyCaption: {
            type: String
        },
        music: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users"
        }
    }]

});

export default mongoose.model("Profile", Profile);