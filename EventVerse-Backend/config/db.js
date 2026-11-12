const mongoose = require('mongoose');


// async/await aur try/catch ka use ho raha h, database connect hone mein thoda time lgta h, toh await code ko tb tk rok ke rkhta h jb tk connection ban na jaye.
// agar koi error aaye toh server crash hone se bachane ke liye catch block error ko handle kr leta hai.
const connectDB = async ()=> {
    try{
        //process.env ki madad se hum .env file se MONGO_URL utha rahe hain
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected Successfully: ${conn.connection.host}`);
    } catch(error){
        console.error(`Database connection failed: ${error.message}`);
        process.exit(1) //agar database connect  na ho to server ko turant band kr do
    }
};

module.exports = connectDB; //Is function ko export kiya taki index.js isko use kar sake.