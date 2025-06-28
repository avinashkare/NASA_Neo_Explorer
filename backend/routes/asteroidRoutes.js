const express = require('express');
const AsteroidController = require('../controllers/asteroidController');

const router = express.Router();

/**
 * Route to get asteroid data (fetch from NASA and store it in DB if not available)
 */
router.get('/neos/list', AsteroidController.getAsteroidsList);

/**
 * Route to retrieve asteroid data from the database
 */
router.get('/neos', AsteroidController.getAsteroids);

module.exports = router;