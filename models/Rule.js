const mongoose = require("mongoose");

const ruleSchema = new mongoose.Schema({
  ruleString: {
    type: String,
    required: true,
  },
  // You can add other fields here as needed
});

const Rule = mongoose.model("Rule", ruleSchema);

module.exports = Rule;
