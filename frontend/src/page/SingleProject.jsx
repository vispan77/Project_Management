import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api';
import toast from 'react-hot-toast';
import { Trash, Edit } from 'lucide-react';

function SingleProject() {

    const [project, setProject] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo"
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editTaskData, setEditTaskData] = useState({
        _id: "",
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo"
    });

    //id for the project
    const { id } = useParams();

    //get the project
    const fetchSingleProject = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/projects/getbyid/${id}`);
            setProject(response.data.data);
        } catch (error) {
            console.log("something wrong while fecthing project ", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    //get alll the task for that project
    const fetchTaskByProjectId = async () => {
        try {
            const response = await api.get(`/projects/${id}/tasks`);
            const sortedTasks = (response.data.data || []).reverse();
            setTasks(sortedTasks);
        } catch (error) {
            console.log("something wrong while fecthing task ", error.message);
        }

    }



    //create task
    const createTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${id}/tasks`, {
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                priority: newTask.priority,
                due_date: newTask.dueDate
            });
            toast.success("Task created successfully!");
            setIsModalOpen(false);
            setNewTask({
                title: "",
                description: "",
                dueDate: "",
                priority: "medium",
                status: "todo"
            });
            fetchTaskByProjectId();
        } catch (error) {
            console.log("Error creating task", error.message);
            toast.error("Failed to create task");
        }
    }

    const deleteTask = async (taskid) => {
        try {
            await api.delete(`/tasks/${taskid}`);
            toast.success("task is deleted successfully");
            fetchSingleProject();
            fetchTaskByProjectId();
        } catch (error) {
            toast.error("Failed to delete task");
            console.log("Failed to delete task");
        }
    }

    //update task status
    const updateTaskStatus = async (taskid, newStatus) => {
        try {
            await api.put(`/tasks/${taskid}`, { status: newStatus });
            toast.success("Task status updated");
            fetchTaskByProjectId();
        } catch (error) {
            console.log("Error updating task status", error.message);
            toast.error("Failed to update status");
        }
    }

    const handleEditClick = (task) => {
        setEditTaskData({
            _id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.due_date ? task.due_date.split('T')[0] : "",
            priority: task.priority || "medium",
            status: task.status || "todo"
        });
        setIsEditModalOpen(true);
    };

    const handleEditTaskSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/tasks/${editTaskData._id}`, {
                title: editTaskData.title,
                description: editTaskData.description,
                status: editTaskData.status,
                priority: editTaskData.priority,
                due_date: editTaskData.dueDate
            });
            toast.success("Task updated successfully!");
            setIsEditModalOpen(false);
            fetchTaskByProjectId();
        } catch (error) {
            console.log("Error updating task", error.message);
            toast.error("Failed to update task");
        }
    };


    const [filterStatus, setFilterStatus] = useState("all");
    const [sortBy, setSortBy] = useState("default");

    const getFilteredAndSortedTasks = () => {
        let result = [...tasks];

        if (filterStatus !== "all") {
            result = result.filter(task => (task.status || 'todo') === filterStatus);
        }
        console.log("result ", result);
        console.log("filterstatus ", filterStatus);


        if (sortBy === "dueDateAsc") {
            result.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
        } else if (sortBy === "dueDateDesc") {
            result.sort((a, b) => new Date(b.due_date) - new Date(a.due_date));
        }

        return result;
    };

    const displayedTasks = getFilteredAndSortedTasks();

    console.log("displayedTasks ", displayedTasks);

    const formatDate = (dateString) => {
        if (!dateString) return 'No date set';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    useEffect(() => {
        fetchSingleProject();
        fetchTaskByProjectId();

    }, []);



    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-8">
                <Link to="/projects" className="text-green-600 hover:text-green-800 mb-4 inline-block">
                    &larr; Back to Projects
                </Link>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{project?.name}</h1>
                        <p className="text-gray-600 mt-2">{project?.description}</p>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-20 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading project details...</p>
                </div>
            ) : (

            <div className="grid grid-cols-1 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {tasks.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="text-sm border border-gray-300 rounded-md p-1.5 
                                focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="todo">To Do</option>
                                <option value="inprogress">In Progress</option>
                                <option value="done">Done</option>
                            </select>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-gray-300 
                                rounded-md p-1.5 focus:outline-none focus:ring-2
                                 focus:ring-green-500 cursor-pointer"
                            >
                                <option value="default">Default</option>
                                <option value="dueDateAsc">Due Date (Urgent)</option>
                                <option value="dueDateDesc">Due Date (Not Urgent)</option>
                            </select>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="bg-green-600 text-white px-3 py-1.5 
                                text-sm rounded-md hover:bg-green-700 
                                transition-colors cursor-pointer"
                            >
                                + New Task
                            </button>
                        </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                        {displayedTasks.length > 0 ? (
                            displayedTasks.map((task) => (
                                <div key={task._id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                                            <p className="text-gray-600 mt-1">{task.description}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <select
                                                value={task.status}
                                                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                                                className="text-sm border rounded p-1 focus:outline-none focus:ring-1
                                                 focus:ring-green-500 cursor-pointer"
                                            >
                                                <option value="todo">To Do</option>
                                                <option value="inprogress">In Progress</option>
                                                <option value="done">Done</option>
                                            </select>
                                            <button onClick={() => handleEditClick(task)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors cursor-pointer">
                                                <Edit className='h-5 w-5' />
                                            </button>
                                            <button onClick={() => { deleteTask(task._id) }}
                                                className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                                                <Trash className='h-5 w-5' />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                        <div className="flex items-center gap-1">
                                            <span className="font-semibold">Due Date:</span>
                                            {formatDate(task.due_date)}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold">Priority:</span>
                                            <span className={`${task.priority === 'high' ? 'text-red-600' :
                                                task.priority === 'medium' ? 'text-orange-500' : 'text-green-500'
                                                } font-medium capitalize`}>
                                                {task.priority || 'normal'}
                                            </span>

                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${task.status === 'done' ? 'bg-green-100 text-green-800' :
                                                task.status === 'inprogress' ? 'bg-green-100 text-green-800' :
                                                    task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {task.status === 'todo' ? 'To Do' : task.status === 'inprogress' ? 'In Progress' : task.status === 'done' ? 'Done' : task.status || 'Pending'}
                                            </span>
                                        </div>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <div className="p-12 text-center text-gray-500">No tasks found for this project.</div>
                        )}
                    </div>
                </div>
            </div>
            )}

            {/* edit task modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
                        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
                        <form onSubmit={handleEditTaskSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-title">
                                    Task Title
                                </label>
                                <input
                                    id="edit-title"
                                    type="text"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    placeholder="Enter task title"
                                    value={editTaskData.title}
                                    onChange={(e) => setEditTaskData({ ...editTaskData, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-description">
                                    Description
                                </label>
                                <textarea
                                    id="edit-description"
                                    required
                                    rows="3"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    placeholder="Enter task description"
                                    value={editTaskData.description}
                                    onChange={(e) => setEditTaskData({ ...editTaskData, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-status">
                                        Status
                                    </label>
                                    <select
                                        id="edit-status"
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={editTaskData.status}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, status: e.target.value })}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-priority">
                                        Priority
                                    </label>
                                    <select
                                        id="edit-priority"
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={editTaskData.priority}
                                        onChange={(e) => setEditTaskData({ ...editTaskData, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-dueDate">
                                    Due Date
                                </label>
                                <input
                                    id="edit-dueDate"
                                    type="date"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    value={editTaskData.dueDate}
                                    onChange={(e) => setEditTaskData({ ...editTaskData, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                >
                                    Update Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* create new task modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
                        <h2 className="text-xl font-bold mb-4">Create New Task</h2>
                        <form onSubmit={createTask}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Task Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    placeholder="Enter task title"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    rows="3"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    placeholder="Enter task description"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                            <div className="mb-4 flex gap-4">
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                                        Status
                                    </label>
                                    <select
                                        id="status"
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={newTask.status}
                                        onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="done">Done</option>
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                                        Priority
                                    </label>
                                    <select
                                        id="priority"
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                        value={newTask.priority}
                                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    >
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
                                    Due Date
                                </label>
                                <input
                                    id="dueDate"
                                    type="date"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    value={newTask.dueDate}
                                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                                >
                                    Save Task
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleProject