import Users from "../UsersDatabase/Users/users";
import jwt from "jsonwebtoken";


export const protect =async(req,res,next)=>{

    let token;

    try{


        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){

            token = req.headers.authorization.split(" ")[1];

            const users = jwt.verify(token,process.env.JWT_SECRET);

            req.users = await Users.findById(users._id).select("-password");

            next();



        }

    }
    catch(err){

    }




}