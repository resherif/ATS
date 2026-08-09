const candidatesModel = require('../Queries/candidates');

const getAllCandidates = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const offset = (page - 1) * limit;

        const { candidates, totalCount } = await candidatesModel.getAllCandidatesPaginated(limit, offset);
        
        return res.status(200).json({
            success: true,
            message: 'Candidates data retrieved successfully!',
            data: candidates,
            totalCount: totalCount
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error!', error: err.message });
    }
};

const getCandidateById = async (req, res) => { 
    try {
        const { id } = req.params;
        const candidate = await candidatesModel.getCandidateId(id);
        if (!candidate) {
            return res.status(404).json({ message: "No Candidate found!" });
        }
        return res.status(200).json({
            success: true,
            message: 'Candidate retrieved successfully!',
            data: candidate
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const createNewCandidate = async (req, res) => { 
    try { 
        const { candidate_name, email, skills, resume_url } = req.body;
        const newCandidate = await candidatesModel.createCandidate(candidate_name, email, skills, resume_url);
        return res.status(201).json({
            success: true,
            message: "Candidate created successfully!",
            data: newCandidate
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const EditCandidate = async (req, res) => {
    try { 
        const { id } = req.params;
        const { candidate_name, email, skills, resume_url } = req.body;

        if (!candidate_name && !email && skills === undefined && !resume_url) {
            return res.status(400).json({ message: 'No fields provided to update!' });
        }

        const updatedCandidate = await candidatesModel.editCandidateInfo(id, candidate_name, email, skills, resume_url);
        return res.status(200).json({
            success: true,
            message: "Candidate updated successfully!",
            data: updatedCandidate
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

const DeleteCandidate = async (req, res) => { 
    try { 
        const { id } = req.params;
        const deletedCandidate = await candidatesModel.deleteCandidate(id);
    
        return res.status(200).json({
            success: true,
            message: "Candidate deleted successfully!",
            data: deletedCandidate
        });
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', error: err.message });
    }
};

module.exports = {
    getAllCandidates,
    getCandidateById,
    createNewCandidate,
    DeleteCandidate,
    EditCandidate
};