const User = require('../models/User');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 


exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            role: role || 'student'
        });
        await newUser.save();

        res.status(201).json({ message: "Registration Successful!" });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Email or Username is wrong" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password is wrong" });

        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1d' } 
        );

        res.status(200).json({ 
            message: "Login successful!", 
            token, 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};