import express from "express";
const taskRouter = express.Router();



//import the controllers
import { changeTaskStatus, createTask, deleteTaskById, filterTaskByStatus, getTaskByProjectId, updateTaskById } from "../controllers/taskControllers.js";



//moount the routes
taskRouter.post("/projects/:project_id/tasks", createTask);
taskRouter.get("/projects/:project_id/tasks", getTaskByProjectId);
taskRouter.delete("/tasks/:id", deleteTaskById);
taskRouter.put("/tasks/:id", updateTaskById);
taskRouter.get("/projects/:project_id/task", filterTaskByStatus);
taskRouter.put("/task/:id", changeTaskStatus);














//export the routes
export default taskRouter;