const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 11000;

// Middleware
app.use(cors());
app.use(express.json());

// --------------------------------------
// ✅ Connect to MongoDB Atlas
// --------------------------------------
mongoose
  .connect(
    "mongodb+srv://preethiusha007_db_user:ZmpaqAYxhpNtVfgv@cluster0.5zvyv1w.mongodb.net/studentDB?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ Connected to MongoDB Atlas!"))
  .catch((err) => console.error("❌ MongoDB Atlas Connection Error:", err));

// --------------------------------------
// Student Schema
// --------------------------------------
const studentSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  educationLevel: String,
  institution: String,
  fieldOfStudy: String,
  yearOfStudy: Number,
});

const Student = mongoose.model("Student", studentSchema);

// --------------------------------------
// Student Registration API
// --------------------------------------
app.post("/register-student", async (req, res) => {
  try {
    console.log("📩 Received Data:", req.body);

    const newStudent = new Student(req.body);
    await newStudent.save();

    res.status(201).json({
      success: true,
      message: "✅ Student registered successfully!",
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({
      success: false,
      message: "❌ Failed to register student.",
    });
  }
});

// Test Route
app.get("/", (req, res) => {
  res.send("🚀 Server is running!");
});

// Start Server
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
