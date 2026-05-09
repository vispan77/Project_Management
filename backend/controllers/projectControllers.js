import Project from "../models/Project.js";


//create a project entry in the database
const createProject = async(req, res) => {
    try {
        //fetch the name and description from the req ki body
        const {name, description} = req.body;

        if(!name || !description){
            return res.status(404).json({
                success: false,
                message: "Please enter all the details properly"
            })
        }

        const project = new Project({
            name, 
            description
        });

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project is created successfuly",
            data: project
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "failed to create projecrt",
            error: error.message
        });
    }
}


//get all the project from the database
const getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find();

        return res.status(200).json({
            success: true,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "failed to fetch projects",
            error: error.message
        });
    }
}


//get single project by id
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: project
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server failed to fetch project",
            error: error.message
        })

    }
};


//delete the project by  id
const deleteProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        const project = await Project.findByIdAndDelete(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            })
        }

        return res.status(200).json({
            sucess: true,
            message: "Project deleted successfully"
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Server failed to delete project",
            error: error.message
        })
    }
}





export {
    createProject,
    getAllProjects,
    getProjectById,
    deleteProjectById,
  
    
}
