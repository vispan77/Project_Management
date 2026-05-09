import express from "express";
const app = express();
import dotenv from "dotenv";
import dbConnect from "./config/dbConnect.js";
import projectRouter from "./routes/projectRouter.js";
import taskRouter from "./routes/taskRouter.js";
import cors from "cors"

dotenv.config();

//middleware
app.use(express.json());
app.use(cors({
    origin: [
        process.env.FRONTEND_URL,
        "http://localhost:5173"
    ]
}));


//routes
app.use("/api/projects", projectRouter);
app.use("/api", taskRouter);


//database connection
await dbConnect();

//statring server
const PORT = process.env.PORT || 3000;
app.listen(PORT, (req, res) => {
    console.log("Server is listening at port 3000")
});

app.get("/", (req, res) => {
    res.send("Welcome to the Home page")
})
