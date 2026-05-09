import express from "express";
const projectRouter = express.Router();


//import the controller
import { createProject, deleteProjectById, getAllProjects, getProjectById } from "../controllers/projectControllers.js";



//mount the routes
projectRouter.post("/create", createProject);
projectRouter.get("/getall", getAllProjects);
projectRouter.get("/getbyid/:id", getProjectById);
projectRouter.delete("/delete/:id", deleteProjectById);






//export the routes
export default projectRouter;