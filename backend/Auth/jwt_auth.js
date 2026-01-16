
import Users from "../UsersDatabase/Users/users.js";
import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {


    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

            token = req.headers.authorization.split(" ")[1];

            const users = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await Users.findById(users._id).select("-password");

            if (!users) {
                return res.status(400).json({ message: "User not verified" });
            }

            next();
        }


    }
    catch (error) {
        console.log(error);
    };

}

