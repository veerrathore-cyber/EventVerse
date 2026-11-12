const express = require('express');
const router = express.Router();

// 1. apna banaya hua middleware aur controller import karo
const verifyToken = require('../middleware/auth');
const {
    createEvent,
    getEvents,
    bookEvent,
    unbookEvent,
    getMyBookings,
    deleteEvent
} = require('../controllers/eventController');

// 2. Public Route (Bina bouncer ke)
// isme verifytoken nhi lagaya kyuki events to koi bhi dekh skta h bina login ke
router.get('/all', getEvents);

// 3. Private Routes (Bouncer ke sath)
// ab dhayan se dekho URL aur function ke bich verifytoken khada kr diya h 
// ab jb tk token verify in hoga tb tk request controller ke function ke pass nhi jayegi
router.post('/create',verifyToken,createEvent);
router.post('/book/:id',verifyToken,bookEvent);
router.post('/unbook/:id',verifyToken,unbookEvent);
router.get('/mybookings',verifyToken,getMyBookings);
router.delete('/delete/:id', verifyToken, deleteEvent);

module.exports = router;