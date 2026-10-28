const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: "Access Denied. Bhai, Token kahan hai?" });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        
        req.user = decoded; 
        next(); 
    } catch (error) {
        res.status(400).json({ message: "Invalid Token. Ye ticket nakli hai!" });
    }
};

module.exports = authMiddleware;