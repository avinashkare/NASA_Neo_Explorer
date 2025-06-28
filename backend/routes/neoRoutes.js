const express = require('express');
const router = express.Router();
const neoController = require('../controllers/neoController');

/**
 * @route GET /api/neos/list
 * @desc Fetch NEO data for a date range, fetching from NASA if needed
 */
router.get('/list', neoController.getNeoList);

/**
 * @route GET /api/neos
 * @desc Fetch NEO data from database for a date range
 */
router.get('/', neoController.getNeoFromDB);

module.exports = router;