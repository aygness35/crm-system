const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const protect = require("../middleware/authMiddleware");

router.use(protect);

/* GET ALL */
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* CREATE */
router.post("/", async (req, res) => {
  try {
    if (!req.body.name || !req.body.email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const customer = await Customer.create({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone || "",
      company: req.body.company || "",
    });

    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* UPDATE */
router.put("/:id", async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        company: req.body.company,
      },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* DELETE */
router.delete("/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
