import Admin from "../models/Admin.model.js";
import bcrypt from "bcrypt";
import setUser from "../services/auth.services.js";

async function handleAdminSignup(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!!!" });
        }

        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: "User already exits!!!" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        //crate the admin

        const admin = await Admin.create({
            name: name,
            email: email,
            password: hashedPassword
        });

        return res.status(201).json({
            message: "user has been signed up successfully!!"
        });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
}

async function handleAdminLogin(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password required!!!"
            });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(404).json({
                error: "admin not found!!!"
            });
        }

        //match password 
        const isMatch = await bcrypt.compare(password, admin.password)

        if (!isMatch) {
            return res.status(404).json({
                error: "Wrong password!!"
            });
        }

        //create token
        const token = setUser(admin);

        //set cookie
        res.cookie("uid", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(
            {
                message: "Admin logged in successfully!!!"
            }
        );
    }
    catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }

}
async function handleGetMe(req,res)
{
    return res.status(200).json({
        admin: req.user
    });
}
export { handleAdminSignup, handleAdminLogin,handleGetMe };