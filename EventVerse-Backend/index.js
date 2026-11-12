//1. Sabse pehle envirnoment variables load karo taki secret avaliable ho 
//hamarei secret details jaise mangoDB ka URL link and JWT ki secret key ko ek.env file me safe rakhne ke liye, taki wo Github par leak na ho
require('dotenv').config();

//express ye ek web framework h jo server banayega aur alg-alg API routes(jaise /login, /events , /book) handle karega
//cors ye Frontend(React jo port 5173 par chalta hai) ko Backend(jo port 3000 pe chlta h) se data mangne ki permission dega 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db') //db.js file create ki for database handle

//Database connect
connectDB();

//2. Express ki power 'app' variable mein initialize karna
const app = express();

//3. Middlewares(har request server tak pahunchane se pehle inme se hokar guzregi)
app.use(express.json()); //Frontend se aane wala JSON data (jaise form ka data) ko req.body mein padhne ke liye allow karta hai 
app.use(cors()); //React frontend ko is server par request marne ki chhut deta hai

//add new routes here
const authRoutes = require('./routes/authRoutes');
//frontend API ko aise call karega: https://localhost:3000/api/auth/register
app.use('/api/auth', authRoutes);

//jo routes create kiye
const eventRoutes = require("./routes/eventRoutes");
app.use('/api/events', eventRoutes);

//4. Basic Test Route (Check karne ke liye ki server zinda h ya nhi)
app.get('/', (req, res) => {
    res.send("EventVerse API ekdum mast chal rahi hai!");
});

//5. Server Start karna
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
});