const Event = require('../models/Event');

exports.createEvent = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Access Denied! only admin can make events." });
        }
        const { title, description, date, totalSeats, location } = req.body;
        const newEvent = new Event({ title, description, date, totalSeats, location });
        await newEvent.save();
        res.status(201).json({ 
            message: "Event Successfully Created!", 
            event: newEvent 
        });
    } catch (error) {
        res.status(500).json({
            message: "Server Error", 
            error: error.message 
        });
    }
};

exports.getEvents = async (req, res) => {
    try {
    const { page = 1, limit = 6, category } = req.query;
    let query = {};

    if (category) {
      query = {
        $or: [
          { title: { $regex: category, $options: 'i' } },
          { description: { $regex: category, $options: 'i' } }
        ]
      };
    }

    const events = await Event.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
      
    const total = await Event.countDocuments(query);

    res.status(200).json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching events", error });
  }
};

exports.bookEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event nahi mila!" });

        if (event.bookedStudents.length >= event.totalSeats) {
            return res.status(400).json({ message: "House Full! Koi seat khali nahi hai." });
        }

        if (event.bookedStudents.includes(userId)) {
            return res.status(400).json({ message: "Aapne already seat book kar li hai!" });
        }

        event.bookedStudents.push(userId);
        await event.save();

        res.status(200).json({ 
            message: "Seat Booked Successfully! 🎉", 
            event 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
};

exports.unbookEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event nahi mila!" });

        const isBooked = event.bookedStudents.some(id => id.toString() === userId);
        
        if (!isBooked) {
            return res.status(400).json({ message: "Aapne ye seat book hi nahi ki hai!" });
        }

        event.bookedStudents = event.bookedStudents.filter(id => id.toString() !== userId);
        await event.save();

        res.status(200).json({ message: "Booking Cancelled! Seat wapas khali ho gayi." });
    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        const events = await Event.find({ bookedStudents: userId }).sort({ date: 1 });
        res.status(200).json({ events });
    } catch (error) {
        res.status(500).json({ 
            message: "Server Error", 
            error: error.message 
        });
    }
};