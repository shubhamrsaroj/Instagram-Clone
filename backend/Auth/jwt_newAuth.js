import jwt from "jsonwebtoken";
import Users from "../UsersDatabase/Users/users";

export const protect =async(req,res,next)=>{


    try{

        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
            
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await Users.findById(decoded._id).select("-password");

            if(!decoded){
                res.status(400).json({message:"users not verified"});
            }

            next();

        }

    }
    catch(err){
        console.log(err);
    }

}
