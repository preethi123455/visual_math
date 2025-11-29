const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 10000;

// Middleware
app.use(express.json());
app.use(cors());

// --------------------------------
// ✅ CONNECT TO MONGODB ATLAS
// --------------------------------
mongoose
  .connect(
    "mongodb+srv://preethiusha007_db_user:ZmpaqAYxhpNtVfgv@cluster0.5zvyv1w.mongodb.net/mentorsDB?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("✅ MongoDB Atlas Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// --------------------------------
// Mentor Schema
// --------------------------------
const mentorSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  phoneNumber: String,
  specialization: String,
  experience: Number,
  qualification: String,
  certificate: String, // Base64 string
});

const Mentor = mongoose.model("Mentor", mentorSchema);

// --------------------------------
// Multer Storage (Memory, No Upload Folder)
// --------------------------------
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --------------------------------
// Mentor Verification API
// --------------------------------
app.post(
  "/mentor-verification",
  upload.single("certificate"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "Certificate file is required" });
      }

      // Convert to Base64
      const certificateBase64 = req.file.buffer.toString("base64");

      const newMentor = new Mentor({
        fullName: req.body.fullName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        specialization: req.body.specialization,
        experience: req.body.experience,
        qualification: req.body.qualification,
        certificate: certificateBase64,
      });

      await newMentor.save();
      res.json({
        success: true,
        message: "Mentor verification submitted successfully!",
      });
    } catch (error) {
      console.error("Server Error:", error);
      res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  }
);

// --------------------------------
// Start Server
// --------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
