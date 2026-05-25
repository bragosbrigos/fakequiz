const express = require('express');
const router = express.Router();
const { getSchedule, syncMatches, updateImages, initDatabase } = require('../controllers/scheduleController');

router.get('api/schedule', getSchedule);
router.post('/schedule/sync', syncMatches);
router.post('/update-images', updateImages);
router.post('/init-db', initDatabase);

module.exports = router;
