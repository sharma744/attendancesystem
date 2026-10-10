
import "dotenv/config";
import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { fileURLToPath } from "url";
import clientPromise from "./redis.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mailauth = async (req, res) => {
    const { username, password } = req.body;

    if (!username) {
        return res.status(400).json({
            msg: "Email address is required"
        });
    }

    // Generate a six-digit OTP
    const otp = String(
        Math.floor(100000 + Math.random() * 900000)
    );

    try {
        const client = await clientPromise;

        // Store OTP in Redis for 5 minutes
        await client.set(username, otp, {
            EX: 300
        });

        // Configure Brevo SMTP
        const transport = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_KEY
            }
        });

        // Render the DiwaliHaat EJS invitation
        const html = await ejs.renderFile(
            path.join(
                __dirname,
                "../views/index.ejs"
            ),
            {
                name: username.split("@")[0],
                email: username,
                otp,
                expiryMinutes: 5
            }
        );

        // Send invitation email
        await transport.sendMail({
            from: `"DiwaliHaat" <milaap2k26@gmail.com>`,
            to: username,
            subject: "🪔 Welcome to DiwaliHaat - Verify Your Email",
            html
        });

        return res.status(200).json({
            msg: "DiwaliHaat invitation and OTP sent successfully"
        });

    } catch (err) {
        console.error("Mail authentication error:", err);

        return res.status(500).json({
            msg: "Error generating OTP or sending invitation"
        });
    }
};

export default mailauth;
