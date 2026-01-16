import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import routers from "./Routes/routes.js";
import dotenv from "dotenv";

dotenv.config();

const apis = express();

apis.use(cors({origin:"http://localhost:3000"}));

apis.use(express.json());

const files = fileURLToPath(import.meta.url);

const dirname = path.dirname(files);

apis.use("/uploads",express.static(path.join(dirname,"uploads")));

apis.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}));

apis.use("/api/auth",routers);

mongoose.connect(process.env.MONGODB_URI)
.then(()=>{console.log("mongodb connected")});

apis.listen(5000,()=>{
    console.log("Server Started Successfully");
})
