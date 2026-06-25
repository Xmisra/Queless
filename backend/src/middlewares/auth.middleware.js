import jwt from "jsonwebtoken";

function restrictValidUserOnly(req,res,next)
{
    const token = req.cookies?.uid;

    if(!token)
    {
        return res.status(401).json(
            {
                error : "Unauthorized User!!"
            }
        )
    };

    try{
        const user = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = user;
        next();
    }
    catch(err)
    {
        return res.status(500).json(
            {
                error : err.message
            }
        )
    }
}

export default restrictValidUserOnly;