const ApplicationsModel = require('../Queries/Applications');

const getAllApplications = async (req, res) => { 
    try {
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const { applications, totalCount } = await ApplicationsModel.getAllApplications(limit, offset);

    
        return res.status(200).json({
            success: true,
            data: applications,
            totalCount: totalCount
        });
    } catch (err) { 
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const getApplicationsById = async (req, res) => { 
    try {
        const { application_id } = req.params;
        const application = await ApplicationsModel.getApplicationsById(application_id);
        
        if (!application) {
            return res.status(404).json({ message: "No Application found!" });
        }

        return res.status(200).json({
            success: true,
            message: 'Application retrieved successfully!',
            data: application
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const createNewApplication = async (req, res) => { 
    try { 
        const { candidate_id, job_id, status } = req.body;
        
        
        const applicationStatus = status || 'applied';

        const newApplication = await ApplicationsModel.createNewApplication(candidate_id, job_id, applicationStatus);
        
        return res.status(201).json({
            success: true,
            message: "Application created successfully!",
            data: newApplication
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const EditApplication = async (req, res) => {
    try { 
        const { application_id } = req.params;
        const { candidate_id, job_id, status } = req.body;

        if (candidate_id === undefined && job_id === undefined && status === undefined) {
            return res.status(400).json({ message: 'No fields provided to update!' });
        }

        const updatedApplication = await ApplicationsModel.EditApplication(application_id, candidate_id, job_id, status);
        
        if (!updatedApplication) {
            return res.status(404).json({ message: "Application not found!" });
        }

        return res.status(200).json({
            success: true,
            message: "Application updated successfully!", 
            data: updatedApplication
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const DeleteApplication = async (req, res) => { 
    try { 
        const { application_id } = req.params;
        const deletedApplication = await ApplicationsModel.DeleteApplication(application_id);
        
        if (!deletedApplication) {
            return res.status(404).json({ message: "Application not found!" });
        }

        return res.status(200).json({
            success: true,
            message: "Application deleted successfully!",
            data: deletedApplication
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = {
    getAllApplications,
    getApplicationsById,
    createNewApplication,
    EditApplication,
    DeleteApplication,
};