const router = require('express').Router();
const candidates = require('../controllers/candidatesController');
router.get('/', candidates.getAllCandidates);
router.post('/', candidates.createNewCandidate);
router.get('/:id', candidates.getCandidateById);
router.put('/:id',candidates.EditCandidate)
router.delete('/:id', candidates.DeleteCandidate);

module.exports = router;