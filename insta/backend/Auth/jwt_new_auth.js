import Users from "../UsersDatabase/Users/users";
import jwt from "jsonwebtoken";


export const protect=async(req,res,next)=>{

    try{


        if(req.headers.authorization && req.headers.authorization.starsWith("Bearer")){

            const token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token,process.env.JWT_TOKEN);

            req.users = await Users.findById(decoded._id).select("-password");
            
            next();


        }



    }

    catch(err)
    {
      console.log(err);
    }


}