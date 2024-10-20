// server/routes/ruleRoutes.js

const express = require("express");
const router = express.Router();
const ruleController = require("../controllers/ruleController");
const Rule = require("../models/Rule");

// Route for creating a rule
router.post("/create", ruleController.createRule);

// Route for combining rules
router.post("/combine", ruleController.combineRules);

// Route for evaluating a rule against user data
router.post("/evaluate", ruleController.evaluateRule);

// Add route to fetch all rules (e.g., for frontend listing)
router.get("/", async (req, res) => {
  try {
    const rules = await Rule.find();
    res.status(200).json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
