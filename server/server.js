const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const workoutRoutes = require("./routes/workoutRoutes");
const authRoutes = require("./routes/authRoutes");
const app = express();
const mealRoutes = require("./routes/mealRoutes");


app.use(cors());
app.use(express.json());
app.use("/api/workouts", workoutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/meals", mealRoutes);
app.get("/", (req, res) => {
    res.send("Fitastic Backend is running!");
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});