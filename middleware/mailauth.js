import "dotenv/config"
import nodemailer from "nodemailer";
import clientPromise from "./redis.js";

const mailauth = async (req, res) => {
    const { username, password } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000);

    try {
        const client = await clientPromise;

        await client.set(username, otp.toString(), {
            EX: 300
        });

        const transport = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_USER,
                pass: process.env.BREVO_KEY
            }
        });

        await transport.sendMail({
            from: "diwalihaat<milaap2k26@gmail.com>",
            to: username,
            subject: "OTP Verification",
            text: `${otp}`
        });

        return res.status(200).json({
            msg: "OTP sent successfully"
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Error in generating OTP"
        });
    }
};

export default mailauth;