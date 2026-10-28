const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

app.get('/', (req, res) => {
    res.send("EventVerse API is running perfectly! 🚀");
});

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB (EventVerse DB) connected successfully! 💻"))
.catch((err) => console.log("DB Connection Error: ", err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});