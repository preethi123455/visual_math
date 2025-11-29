const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------
// CONNECT TO MONGODB (Railway + Local Ready)
// -------------------------
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "educonnect",
  })
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// -------------------------
// USER SCHEMA
// -------------------------
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,
});

const User = mongoose.model("User", userSchema);

// -------------------------
// SIGNUP API
// -------------------------
app.post("/signup", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword });

    await user.save();

    res.status(201).json({ message: "Signup successful!" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// -------------------------
// LOGIN API
// -------------------------
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({ message: "Invalid email or password!" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password!" });

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err });
  }
});

// -------------------------
// SERVE REACT FRONTEND
// -------------------------
app.use(express.static(path.join(__dirname, "build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// -------------------------
// START SERVER
// -------------------------
const PORT = process.env.PORT || 11000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
