const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { createEvent, getEvents, bookEvent, unbookEvent, getMyBookings } = require('../controllers/eventController');

router.get('/all', getEvents);
router.post('/create', authMiddleware, createEvent);
router.post('/book/:id', authMiddleware, bookEvent);
router.post('/unbook/:id', authMiddleware, unbookEvent);
router.get('/my-bookings', authMiddleware, getMyBookings);

module.exports = router;