
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => res.send('Fitastic API running'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/meals', require('./routes/mealRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/weights', require('./routes/weightRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server on port ' + PORT));