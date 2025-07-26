const express = require("express");
const router = express.Router();
const Issue = require("../models/Issue");
const { authenticateToken, optionalAuth } = require("../middleware/auth");

// CREATE - requires authentication
router.post("/", authenticateToken, async (req, res) => {
  try {
    const issue = new Issue({
      ...req.body,
      createdBy: req.user._id,
    });
    const saved = await issue.save();
    await saved.populate("createdBy", "username email");
    res.json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL - optional authentication (to show creator info if logged in)
router.get("/", optionalAuth, async (req, res) => {
  try {
    const issues = await Issue.find().populate("createdBy", "username email");
    res.json(issues);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ ONE - optional authentication
router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "createdBy",
      "username email"
    );
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }
    res.json(issue);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE - requires authentication
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    const updated = await Issue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).populate("createdBy", "username email");

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE - requires authentication and ownership or admin
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ error: "Issue not found" });
    }

    // Check if user owns the issue or is admin
    if (
      issue.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ error: "You can only delete your own issues" });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: "Issue deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
