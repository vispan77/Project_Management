import React, { useState, useEffect } from 'react';
import api from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


function Project() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({ name: '', description: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const projectsPerPage = 9;

    const navigate = useNavigate();

    const fetchAllProjects = async () => {
        try {
            setIsLoading(true);
            const response = await api.get("/projects/getall");
            const sortedProjects = (response.data.data || []).reverse();
            setProjects(sortedProjects);
        } catch (error) {
            console.log("Something went wrong in fetching projects ", error.message)
        } finally {
            setIsLoading(false);
        }
    }

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/projects/create", {
                name: newProject.name,
                description: newProject.description
            });
            toast.success('Project created successfully!');
            setIsModalOpen(false);
            setNewProject({ name: '', description: '' });
            fetchAllProjects();
        } catch (error) {
            console.log("Error creating project", error.message);
            toast.error('Failed to create project');
        }
    }

    //delete project
    const deleteProject = async (id) => {
        try {
            await api.delete(`/projects/delete/${id}`);
            toast.success("Project is deleted Succefully");
            // If deleting the last item on a page, go to previous page
            if (currentProjects.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            }
            fetchAllProjects();
        } catch (error) {
            console.log("Failed to delete Project");
            toast.error("Failed to delete Project");
        }
    }



    useEffect(() => {
        fetchAllProjects();
    }, [])

    const indexOfLastProject = currentPage * projectsPerPage;
    const indexOfFirstProject = indexOfLastProject - projectsPerPage;
    const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
    const totalPages = Math.ceil(projects.length / projectsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    console.log("project ", projects);


    return (
        <div className="p-10 relative">

            <Link to="/" className="text-green-600 hover:text-green-800 mb-4 inline-block">
                &larr; Back to Home
            </Link>


            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                    Projects <span className='text-sm text-gray-500'>Total Project : {projects.length}</span>
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md
                     hover:bg-green-700 transition-colors cursor-pointer"
                >
                    + New Project
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-20 space-y-4">
                    <div className="relative w-16 h-16">
                        <div className="absolute inset-0 rounded-full border-4 border-green-100"></div>
                        <div className="absolute inset-0 rounded-full border-4 border-green-600 border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-500 font-medium animate-pulse">Loading projects...</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProjects.map((project) => (
                    <div key={project._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>

                            <button className='text-red-500 cursor-pointer hover:text-red-700'
                                onClick={() => deleteProject(project._id)}>
                                <Trash className='w-5 h-5'/>
                            </button>
                            
                        </div>

                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {project.description || 'No description provided.'}
                        </p>

                        <div className="flex items-center justify-center mt-auto pt-4 border-t border-gray-50">
                            <button onClick={() => { navigate(`/projects/getbyid/${project._id}`) }}
                                className="text-white hover:text-white text-sm font-medium p-1.5 rounded-md bg-green-600 hover:bg-green-700 cursor-pointer">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* pagination controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 border rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-green-600 hover:bg-green-50 border-green-200'}`}
                    >
                        Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => paginate(i + 1)}
                            className={`px-4 py-2 border rounded-md ${currentPage === i + 1 ? 'bg-green-600 text-white border-green-600' : 'bg-white text-green-600 hover:bg-green-50 border-green-200'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 border rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-green-600 hover:bg-green-50 border-green-200'}`}
                    >
                        Next
                    </button>
                </div>
            )}

            {projects.length === 0 && !isLoading && (
                <div className="text-center py-12">
                    <p className="text-gray-500">No projects found. Create your first project to get started!</p>
                </div>
            )}
                </>
            )}

            {/* create new project */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full m-4">
                        <h2 className="text-xl font-bold mb-4">Create New Project</h2>
                        <form onSubmit={handleCreateSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                                    Project Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    placeholder="Enter project name"
                                    value={newProject.name}
                                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    required
                                    rows="4"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-green-500"
                                    placeholder="Enter project description"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
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
                                    Save Project
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Project;