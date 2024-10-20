class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type; // "operator" or "operand"
    this.left = left; // Reference to the left child node
    this.right = right; // Reference to the right child node
    this.value = value; // Value for operand nodes (conditions like "age > 30")
  }
}

// Helper function to evaluate a single condition
const evaluateCondition = (condition, userData) => {
  // Split the condition into components (e.g., "age > 30" becomes ["age", ">", "30"])
  const match = condition.match(/(\w+)\s*(=|==|!=|>|<|>=|<=)\s*([\w'"]+)/);
  if (!match) {
    throw new Error(`Invalid condition: ${condition}`);
  }

  const [, field, operator, value] = match;
  const userValue = userData[field];

  // Remove single or double quotes from string values (e.g., "'Sales'" -> "Sales" or `"Sales"` -> `Sales`)
  const parsedValue =
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
      ? value.slice(1, -1)
      : isNaN(value)
      ? value
      : Number(value); // convert numeric strings to numbers

  // Evaluate the condition based on the operator
  switch (operator) {
    case "==":
    case "=":
      return userValue == parsedValue; // Using loose equality to handle both string and number comparisons
    case "!=":
      return userValue != parsedValue;
    case ">":
      return userValue > parsedValue;
    case "<":
      return userValue < parsedValue;
    case ">=":
      return userValue >= parsedValue;
    case "<=":
      return userValue <= parsedValue;
    default:
      throw new Error(`Unknown operator: ${operator}`);
  }
};

const evaluateAST = (node, userData) => {
  // Base case: if the node is an operand, evaluate it
  if (node.type === "operand") {
    return evaluateCondition(node.value, userData);
  }

  // Check if left or right children are null
  const leftValue = node.left ? evaluateAST(node.left, userData) : true; // If null, assume true for AND cases
  const rightValue = node.right ? evaluateAST(node.right, userData) : true; // If null, assume true for AND cases

  // Apply the operator (AND/OR)
  if (node.value === "AND") {
    return leftValue && rightValue;
  } else if (node.value === "OR") {
    return leftValue || rightValue;
  }

  throw new Error(`Unknown operator: ${node.value}`);
};


// Helper function to check if a token is an operator
const isOperator = (token) => token === "AND" || token === "OR";

// Helper function to determine operator precedence
const precedence = (operator) => {
  if (operator === "AND") return 2;
  if (operator === "OR") return 1;
  return 0;
};

// Function to create the AST from a rule string
const createAST = (rule) => {
  // Ensure the rule is a valid string
  if (typeof rule !== "string") {
    throw new Error("Invalid input: Rule must be a string.");
  }

  // Tokenize the input rule using regex to capture the full conditions as a single operand
  const tokens = rule.match(/(\w+\s*[><=]+\s*[\w'"]+|AND|OR|\(|\))/g);

  // Check if tokens were properly generated
  if (!tokens) {
    throw new Error("Invalid rule: Could not tokenize input.");
  }

  // Helper function to parse expressions based on operator precedence
  const parseExpression = (tokens) => {
    let stack = [];
    let operators = [];

    // Helper function to process the top of the stack for operators
    const processOperator = () => {
      const operator = operators.pop();
      const right = stack.pop();
      const left = stack.pop();
      const node = new Node("operator", left, right, operator);
      stack.push(node);
    };

    // Iterate through each token
    for (let token of tokens) {
      if (token === "(") {
        operators.push(token);
      } else if (token === ")") {
        // Pop operators until we hit the corresponding '('
        while (operators.length && operators[operators.length - 1] !== "(") {
          processOperator();
        }
        operators.pop(); // Pop the '('
      } else if (isOperator(token)) {
        // Process operators according to precedence
        while (
          operators.length &&
          precedence(operators[operators.length - 1]) >= precedence(token)
        ) {
          processOperator();
        }
        operators.push(token);
      } else {
        // Treat anything else as an operand (e.g., condition like "age > 30")
        stack.push(new Node("operand", null, null, token.trim()));
      }
    }

    // Process remaining operators
    while (operators.length) {
      processOperator();
    }
    return stack[0]; // Return the AST (top-level node in the stack)
  };

  // Call the parseExpression function with the tokenized rule
  return parseExpression(tokens);
};

// Function to print the AST for debugging
const printTree = (node, depth = 0) => {
  if (node === null) {
    console.log("  ".repeat(depth) + "null");
    return;
  }

  // Print the current node with its type and value
  console.log(
    "  ".repeat(depth) + `${node.type}: ${node.value}` // Include type information for better clarity
  );

  // If it is an operator, show left and right children
  if (node.type === "operator") {
    console.log("  ".repeat(depth) + "Left:");
    printTree(node.left, depth + 1);
    console.log("  ".repeat(depth) + "Right:");
    printTree(node.right, depth + 1);
  }
};

// Function to combine multiple ASTs using AND as the operator
const combineAST = (ruleASTs) => {
  const root = new Node("operator", null, null, "AND");
  let currentNode = root;

  ruleASTs.forEach((ast, index) => {
    if (index === 0) {
      currentNode.left = ast;
    } else {
      currentNode.right = ast;
    }
    if (index < ruleASTs.length - 1) {
      const operatorNode = new Node("operator", null, null, "AND");
      currentNode.right = operatorNode;
      currentNode = operatorNode;
    }
  });

  return root;
};

module.exports = {
  createAST,
  evaluateAST,
  combineAST,
  printTree,
};
