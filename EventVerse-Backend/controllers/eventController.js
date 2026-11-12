// 1. apna event ka naksha(model) bulaya taki database se baat kr ske
const Event = require('../models/Event')

// 1. create event sirf admin ke liye
exports.createEvent = async(req, res) => {
    try{
        // ye 'req.user' yaha isliye aaya kyuki hamare bouncer(verifytoken) ne token kholkar ye details request me dali thi
        // ab ham check kr rahe ki token wale user ka role admin h ki nhi 
        if(req.user.role !== 'admin'){
            return res.status(403).json({message: "Access Denied! only admin can create events"});
        }
        // frontend jo naye event ki details bhejega req.body me , unhe variable me nikala
        const{title, description, date, totalSeats, location} = req.body;

        //mongoose(Event Model) ki help se new event banaya
        const newEvent = new Event({title, description, date, totalSeats, location});

        //is line se ye event MongoDB database me hamesha ke liye save ho jayege
        await newEvent.save();

        res.status(201).json({message: "Event Successfully Created", event: newEvent});
        }
        catch(error){
            res.status(500).json({message: "Server Error", error: error.message});
        }

};

//2. Get All events(Categories aur pagination ke sath)
exports.getEvents = async(req, res) => {
    try{
        //frontend URL se 'page', 'limit', aur 'category' bhejta h jaise-> /all?page=1&category=AI
        // agar page kuch na bheje to hum default page=1 and limit=6 set kr rahe h 
        const{page=1, limit=6, category} = req.query;

        let query = {}; //shuru me query khali h mtlb sb kuch dhundho

        //agar user ne koi specific category select ki h
        if(category && category !== 'All'){
            if(category === 'Other'){
                // other ka logic wo events dhundhko jinke titile/des me ye 5 word nhi h
                const knownCategories = "Web|AI|Cyber Security|Startup|Cloud";
                query={
                    $and: [
                        {title: {$not:{$regex: knownCategories, $options:'i'}}},
                        {description: {$not:{$regex: knownCategories, $options:'i'}}}
                    ]
                };
            }
            else{
                // baki categories ke liye: title ya ($or) Description me vo keyword dhundho
                //option'i' ka mtlb h case insensitive(AI, ai, Ai sab match karega)
                query={
                    $or: [
                        {title:{$regex:category, $options:'i'}},
                        {description:{$regex:category, $options:'i'}}
                    ]
                };
            }
        }

        //Database se dhundhna
        //skip() or limit() se pagination hoti hai
        // aagr page 2 h or limit 6 h  to (2-1)*6 = pehle 6 events skip kr do and next  6 events utha lo
        const events = await Event.find(query)
            .skip((page - 1)*limit)
            .limit(parseInt(limit));

        const total = await Event.countDocuments(query);

        res.status(200).json({
            events,
            totalPages: Math.ceil(total/limit),
            currentPage: page    
        });
    } catch(error){
        res.status(500).json({message: "Error fetching events", error: error.message});
    }
    
};

// regex = search banane ka sabse powerfull tool. ise hum exact match dhundhne ke bajaye text ke andar chupe keywords dhundhte h

// 3. Book an  Event yani seat book krna
exports.bookEvent = async (req, res) => {
    try {
        // req.params.id ka matlab hai URL se ':id' nikalna (jaise /book/65abc123)
        const eventId = req.params.id; 
        
        // req.user.id hamare Bouncer (verifyToken) ne token me se nikal kar di hai
        const userId = req.user.id;

        // 1. Database mein event dhundho
        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found!" });

        // 2. House Full Check: bookedStudents array ki length totalSeats ke barabar ya zyada toh nahi?
        if (event.bookedStudents.length >= event.totalSeats) {
            return res.status(400).json({ message: "Booking Full! no seats available" });
        }

        // 3. Double Booking Check: Kya ye user pehle hi seat le chuka hai?
        if (event.bookedStudents.includes(userId)) {
            return res.status(400).json({ message: "you already book a seat!" });
        }

        // 4. Sab theek hai toh user ki ID ko array mein daal do (push)
        event.bookedStudents.push(userId);
        
        // Database mein update save kar do
        await event.save();

        res.status(200).json({ message: "Seat Booked Successfully!", event });
    } 
    catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// 4. Cancel Booking
exports.unbookEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found!" });

        // Check karo ki user ne sach mein seat book ki thi ya nahi?
        // .some() array mein check karta hai ki kya koi condition match ho rahi hai
        const isBooked = event.bookedStudents.some(id => id.toString() === userId);
        
        if (!isBooked) {
            return res.status(400).json({ message: "You weren't booked!" });
        }

        // .filter() function se hum array mein se us user ki ID ko hata (remove) rahe hain
        event.bookedStudents = event.bookedStudents.filter(id => id.toString() !== userId);
        
        // ID hatane ke baad update save kar do
        await event.save();

        res.status(200).json({ message: "Booking Cancelled!" });
    } 
    catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

//5. Get my Bookings(user ki book huye events)
exports.getMyBookings = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Mongoose ki power: Hum bol rahe hain wo saare events lao jinke
        // 'bookedStudents' wale array ke andar is 'userId' ki entry maujood ho!
        const events = await Event.find({ bookedStudents: userId }).sort({ date: 1 }); // date: 1 matlab purani date pehle
        
        res.status(200).json({ events });
    } 
    catch(error){
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        await Event.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Event Deleted Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};