// server/controllers/ruleController.js
const Rule = require("../models/Rule");
const {
  createAST,
  combineAST,
  evaluateAST,
  printTree,
} = require("../services/ruleServices");

// Create rule and save to the DB
exports.createRule = async (req, res) => {
  try {
    const { ruleString } = req.body;
    const ast = createAST(ruleString);
    const newRule = new Rule({ ruleString }); 
    await newRule.save();
    res.status(201).json({ message: "Rule created", rule: newRule, ast });
    console.log("this is my tree");
    printTree(ast);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Combine multiple rules (ASTs)

exports.combineRules = (req, res) => {
  try {
    const { rules } = req.body;

    // Validate rules
    if (!Array.isArray(rules) || rules.length === 0) {
      return res.status(400).json({ error: "Invalid or empty rules array" });
    }

    // Map each rule to its AST and combine them
    const combinedAST = combineAST(rules.map((rule) => createAST(rule)));

    // Send success response
    res.status(200).json({ message: "Rules combined successfully", combinedAST });
  } catch (error) {
    console.error("Error combining rules:", error.message); // Optional: Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Evaluate a combined rule against user data
exports.evaluateRule = (req, res) => {
  try {
    const { ast, userData } = req.body;
    const result = evaluateAST(ast, userData);
    res.status(200).json({ result, userData, ast });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
