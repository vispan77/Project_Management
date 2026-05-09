import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    project_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["todo", "inprogress", "done"],
        default: "todo"
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    due_date: {
        type: Date,
        required: true
    }

}, { timestamps: true })

const Task = mongoose.model("Task", taskSchema);

export default Task;