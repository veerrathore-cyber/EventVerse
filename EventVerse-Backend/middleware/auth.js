const jwt = require('jsonwebtoken');

// ye function hamara bouncer h 
const verifyToken = (req, res, next) => {
    // 1. Frontend jo Token bhejta h , vo request ke header me chupa hota h 
    let token = req.header('Authorization');

    // 2. Agar token aaya nhi mtlb user login nhi h 
    if(!token){
        return res.status(401).json({message: "Access Denied! please login"});
    }

    try{
        // Frontend hamesha token is formate me bhejta h bearer fdjashyraow389
        // to hum is bearer(7 character) ko hata dete hai
        if(token.startsWith("Bearer")){
            token = token.slice(7, tokenlength).trimleft();
        }
        
        // 3. Token ko apni Secret key se verify krna ki token real h?
        const verified = jwt.verify(token, process.env.JWT_SECRET);

        // 4. token kholne pr jo user ki {id , role} milege, usko hame request(req) ke under "user" name se rkhna h 
        // taki aage jb booking ka logic chale to pata ho ki req.user.id kiski h 
        req.user = verified;

        // next() ka mtlb h bouncer ki checkin ab puri hui request ko ab aage badha do
        next();
    }
    catch(error){
        // agar token verify nhi hua ya expire ho gya to vo yaha aayega
        res.status(400).json({message: "Invalid Token! or Token is expired"})
    }
};

module.exports = verifyToken


/* 
 LOGIC
 req.header: iska kaam h Frontend se aaya hua token pakdana
 jwt.verify: iska kaam h token asli h ya nakli ye check krna
 next(): sab theek hone ke baad request ko aage pass krta ha
*/