const router = require('express').Router();
const jobs = require('../controllers/jobController');
router.get('/', jobs.getAllJobs);
router.post('/', jobs.createNewJob);
router.put('/:id', jobs.EditJob);
router.get('/:id', jobs.getJobById);
router.delete('/:id', jobs.DeleteJob);
module.exports = router;