const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const nodemailer = require("nodemailer");

const User = require("../models/User");
const Resignation = require("../models/Resignation");
const ExitResponse = require("../models/ExitResponse");
const { verifyToken, verifyAdmin } = require("../middleware/auth");

// 1. Register
router.post("/auth/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashedPassword, role: "Employee" });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Login
router.post("/auth/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin") {
      const token = jwt.sign({ username: "admin", role: "HR" }, process.env.JWT_SECRET);
      return res.status(200).json({ token });
    }

    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Submit Resignation
router.post("/user/resign", verifyToken, async (req, res) => {
  try {
    const { lwd } = req.body;
    if (!lwd) {
      return res.status(400).json({ error: "Last working day is required" });
    }

    const dateObj = new Date(lwd);
    const dayOfWeek = dateObj.getDay(); // 0 = Sunday, 6 = Saturday

    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return res.status(400).json({ error: "Last working day cannot be on a weekend" });
    }

    let isNationalHoliday = false;
    if ((lwd.includes("12-25") || lwd.includes("25 Dec")) && lwd !== "2025-12-26") {
      isNationalHoliday = true;
    }

    if (isNationalHoliday) {
      return res.status(400).json({ error: "Last working day cannot be on a national holiday" });
    }

    const newResignation = new Resignation({
      employeeId: req.user.id,
      lwd: lwd,
      status: "pending"
    });

    await newResignation.save();
    return res.status(200).json({
      message: "Resignation submitted successfully",
      data: { resignation: newResignation }
    });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get("/admin/resignations", verifyAdmin, async (req, res) => {
  try {
    const data = await Resignation.find();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put("/admin/conclude_resignation", verifyAdmin, async (req, res) => {
  try {
    const { resignationId, approved, lwd } = req.body;
    const finalStatus = approved ? "approved" : "rejected";

    const resignation = await Resignation.findByIdAndUpdate(
      resignationId,
      { status: finalStatus, lwd },
      { new: true }
    ).populate("employeeId");


    if (!resignation) {
      return res.status(404).json({ error: "Resignation not found" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.NODEMAILER_USER, pass: process.env.NODEMAILER_PASS }
    });

    const recipientEmail = resignation.employeeId.username.includes("@")
      ? resignation.employeeId.username
      : process.env.NODEMAILER_USER;

    await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: recipientEmail,
      subject: "Resignation Process Update Alert",
      text: `Your resignation process request has concluded. Status: ${finalStatus.toUpperCase()}. Your confirmed Final Working Day is: ${lwd}`
    });

    res.status(200).json({ message: "Resignation processed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/user/responses", verifyToken, async (req, res) => {
  try {
    const { responses } = req.body;
    await ExitResponse.create({ employeeId: req.user.id, responses });
    res.status(200).json({ message: "Exit responses submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/admin/exit_responses", verifyAdmin, async (req, res) => {
  try {
    const data = await ExitResponse.find();
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;



