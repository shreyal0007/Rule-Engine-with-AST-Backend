// server/models/Node.js
class Node {
  constructor(type, left = null, right = null, value = null) {
    this.type = type; // "operator" or "operand"
    this.left = left; // left child
    this.right = right; // right child (for operators)
    this.value = value; // value for operand nodes (e.g., number for comparisons)
  }
}

module.exports = Node;
