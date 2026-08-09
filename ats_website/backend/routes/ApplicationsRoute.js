const router = require('express').Router();
const applications = require('../controllers/ApplicationsController');
router.get('/', applications.getAllApplications);
router.post('/', applications.createNewApplication);
router.put('/:id', applications.EditApplication);
router.get('/:application_id', applications.getApplicationsById);
router.delete('/:id', applications.DeleteApplication);
module.exports = router;