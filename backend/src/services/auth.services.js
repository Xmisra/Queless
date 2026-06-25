import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT = process.env.JWT_SECRET;

function setUser(user)
{
    const payload = {
        id : user._id,
        email : user.email,
    }

    return jwt.sign(payload,JWT,{
        expiresIn:"7d"
    });
}

export default setUser;