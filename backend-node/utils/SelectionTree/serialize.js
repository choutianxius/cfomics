const MyNode = require('./MyNode');
const MyTree = require('./MyTree');

function serializeNodeTail (node, data) {
  if ((!node.children) || node.children.length === 0) { return; }
  node.children.forEach((node) => {
    const children = [];
    data.push(
      {
        value: node.value,
        children,
      },
    );
    serializeNodeTail(node, children);
  });
}

function serialize (tree) {
  const data = [];
  serializeNodeTail(tree.root, data);
  return data;
}

function deserializeNodeTail (data, node) {
  if ((!data) || data.length === 0) { return; }
  data.forEach((serializedNode) => {
    const child = new MyNode(serializedNode.value);
    node.children.push(child);
    deserializeNodeTail(serializedNode.children, child);
  });
}

function deserialize (data) {
  const root = new MyNode('*');
  const tree = new MyTree(root);
  deserializeNodeTail(data, root);
  return tree;
}

module.exports = { serialize, deserialize };
