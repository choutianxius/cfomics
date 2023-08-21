/* eslint-disable */

function testSerialize () {
  const root = new MyNode('root');
  const node1 = new MyNode('a');
  const node2 = new MyNode('b');
  const node3 = new MyNode('c');
  const node4 = new MyNode('d');
  const node5 = new MyNode('e');
  const node6 = new MyNode('f');
  root.children.push(node1);
  root.children.push(node2);
  root.children.push(node3);
  node1.children.push(node4);
  node1.children.push(node5);
  node3.children.push(node6);

  const tree = new MyTree(root);

  const serialized = serialize(tree);
  console.log(JSON.stringify(serialized));
}

function testDeserialize () {
  const data = [
    {
      value: 'cfdna',
      children: [
        {
          value: 'methylation',
          children: [],
        },
        {
          value: 'expression',
          children: [],
        },
      ],
    },
    {
      value: 'cfrna',
      children: [],
    },
  ];
  const tree = deserialize(data);
  console.log(JSON.stringify(serialize(tree)));
}

if (require.main === module) {
  testDeserialize();
}
