const JobsModel = require('../Queries/Jobs');

const getAllJobs = async (req, res) => { 
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const { data, totalCount } = await JobsModel.getAllJobsPaginated(limit, offset);

        return res.status(200).json({
            success: true,
            data: data,
            totalCount: totalCount
        });
    } catch (err) { 
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const getJobById = async (req, res) => { 
    try {
        const { id } = req.params;
        const job = await JobsModel.getJobById(id);

        if (!job) {
            return res.status(404).json({ message: "Job not found!" });
        }

        return res.status(200).json({
            success: true,
            message: 'Job retrieved successfully!',
            data: job
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const createNewJob = async (req, res) => { 
    try { 
        const { job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location } = req.body;
        
        const newJob = await JobsModel.createNewJob(job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location);
        
        return res.status(201).json({
            success: true,
            message: "Job created successfully!",
            data: newJob
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const EditJob = async (req, res) => {
    try { 
        const { id } = req.params;
        const { job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location } = req.body;

        if (
            job_title === undefined && description === undefined && status === undefined &&
            requirements === undefined && experience_level === undefined && salary_range === undefined &&
            employment_type === undefined && department === undefined && location === undefined
        ) {
            return res.status(400).json({ message: 'No fields provided to update!' });
        }

        const updatedJob = await JobsModel.EditJob(id, job_title, description, status, requirements, experience_level, salary_range, employment_type, department, location);

        if (!updatedJob) {
            return res.status(404).json({ message: "Job not found!" });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully!",
            data: updatedJob
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const DeleteJob = async (req, res) => { 
    try { 
        const { id } = req.params;
        const deletedJob = await JobsModel.DeleteJob(id);

        if (!deletedJob) {
            return res.status(404).json({ message: "Job not found!" });
        }

        return res.status(200).json({
            success: true,
            message: "Job deleted successfully!",
            data: deletedJob
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = {
    getAllJobs,
    getJobById,
    createNewJob,
    EditJob,
    DeleteJob,
};