import Project from "../models/Project.js";
import Task from "../models/Task.js";


//create a task for the specific project by id
const createTask = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { title, description, status, priority, due_date } = req.body;

        if (!title || !description || !status || !priority || !due_date) {
            return res.status(404).json({
                success: false,
                message: "Please enter all the details properly"
            })
        }


        const task = new Task({
            project_id,
            title,
            description,
            status,
            priority,
            due_date
        });

        await task.save();

        return res.status(200).json({
            success: true,
            message: "Task is created successfully",
            data: task
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while creating the task",
            error: error.message
        })
    }
}

//get the task for specific project by id
const getTaskByProjectId = async (req, res) => {
    try {
        const { project_id } = req.params;


        const tasks = await Task.find({ project_id: project_id });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tasks found for this project"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Tasks found successfully",
            count: tasks.length,
            data: tasks
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server failed to fetch task for the project",
            error: error.message
        })
    }
}



//api for updating the task
const updateTaskById = async (req, res) => {
    try {
        //get the task id
        const { id } = req.params;
        const { title, description, status, priority, due_date } = req.body;

        //find and update the task by id
        const task = await Task.findByIdAndUpdate(id, {
            title: title,
            description: description,
            status: status,
            priority: priority,
            due_date: due_date
        }, { new: true });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Task is updated successfully",
            data: task
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "failed to update task",
            error: error.message
        })
    }
}



//api to delete the specific task
const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("id: = " + id);

        const task = await Task.findByIdAndDelete(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            })
        };

        return res.status(200).json({
            success: true,
            message: "task is deleted"
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "failed to delete task",
            error: error.message
        })
    }
}


//filter task by status
const filterTaskByStatus = async (req, res) => {
    try {

        const { project_id } = req.params

        const { status } = req.query;

        const tasks = await Task.find({ project_id, status });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tasks found with this status"
            })

        }

        return res.status(200).json({
            success: true,
            message: "Tasks found successfully",
            count: tasks.length,
            data: tasks
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "failed to filter the task",
            error: error.message
        })
    }
}








// //change the status of the task
const changeTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await Task.findByIdAndUpdate(id, { status: status }, { new: true });

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({
                success: false,
                message: "no task found"
            })

        }

        return res.status(200).json({
            success: true,
            message: "task status is changed successfully",
            data: task
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "failed to change the task",
            error: error.message
        })
    }
}





export {
    createTask,
    getTaskByProjectId,
    updateTaskById,
    deleteTaskById,
    filterTaskByStatus,
    changeTaskStatus,
    
};
