import "dotenv/config"
import mongoose from "mongoose";
import userRouter from "../serverside/routers/userRoutes.js"
import adminrouter from "../serverside/routers/admindashboard.js"
import bcrypt from "bcrypt"
import cors from "cors"
import path from "node:path";
import { fileURLToPath } from "url";
import express, { urlencoded } from "express";
// import {userRoutes} from "./routers/userRoutes.js"
import auth from "./routers/validation.js"
let app=express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
   process.env.CORS_URL
  // add your real website address when you deploy, for example:
  // "https://diwalihaat.com",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
mongoose.connect(process.env.MONGO_URL);
let db=mongoose.connection
db.once("open",()=>{
    console.log("database connected succesfully")
})
db.on("error",()=>{
   console.log("error")
})

app.use("/users",auth);
app.use("/registration",userRouter)
app.use("/admin",adminrouter)
// app.use("/admin",AdminRoutes);
app.get("/", (req, res) => {
    res.send("Backend is workingknjknjk");
});
app.listen(5001, "0.0.0.0", () => {
    console.log("Server running on port 5000");
});

