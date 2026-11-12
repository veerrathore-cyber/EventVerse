const User = require('../models/User'); // User model ko yaha bulayege
const bcrypt = require('bcryptjs'); // password encrypt krne ke liye
const jwt = require('jsonwebtoken'); // Digital token(ID) banane ke liye

//1. Register Logic
exports.register = async (req, res) =>{
    try{
        const{name, email, password, role} = req.body;

        //Check karo ki email pehele se database mein to nhi h
        let user = await User.findOne({email});
        if(user) return res.status(400).json({message: "Email Already Registered"});

        //password ko hash krna (security ke liye bohot important)
        //salt ka mtlb h password me kuch random text milana taki vo crack na ho sake
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //naya user banao aur save karo
        user = new User({
            name,
            email,
            password: hashedPassword, //Plain password ki jagah encypted password save hoga
            role: role || 'student' //agar frontend se role nhi aaya to by default student bnega
        });
        await user.save();

        res.status(201).json({message: "Account Successfully Created, Now Login!"});
        }catch(error){
            console.log("The real error is this: ", error);
            res.status(500).json({message: "Server error" , error: error.massage});
        }
    };

//2. Login Logic
exports.login = async (req, res) =>{
    try{
        const {email, password} = req.body;

        //user ko dhundho 
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "Account not Found"});

        //password match karo (User ka text password vs Hashpassword stored in database)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Password is incorrect"});

        //JWT token(Digital id card) banana
        //is token ke under ham user ki id and role chupa rahe h 
        const token = jwt.sign(
            {id: user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '1d'} // Token 1 din baad expire ho jayega
        );

        res.status(200).json({ 
        message: "Login successful", 
        token: token, 
        role: user.role  // Database se user ka role nikal kar bhej rahe hain
        });
    }catch(error){
        req.status(500).json({message: "Server error", error: error.message});
    }
};
