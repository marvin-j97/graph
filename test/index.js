const graph = require("../dist/index");

function compare(actual, expected) {
  console.log(actual === expected ? 'Test passed.' : `${actual} differed from expected value: ${expected}`);
}

function compareArrays(actual, expected) {
  const sameLength = actual.length == expected.length;
  console.log((sameLength && actual.every((v, i) => v === expected[i])) ? 'Test passed.' : `Array ${actual} differed from expected array ${expected}`);
}

const g = new graph.Graph();

const a = g.insertVertex("a");
const b = g.insertVertex("b");
const c = g.insertVertex("c");

compare(g.numVertices(), 3);
compare(g.getVertices().length, 3);
compare(a.degree(), 0);
compare(a.incidentEdges().length, 0);

const a_b_edge = g.connectOneway("a", "b");
const c_b_edge = g.connectOneway("c", "b");

compare(a.opposite(a_b_edge), b);
compare(b.opposite(c_b_edge), c);

try {
  g.connectOneway("a", "b");
} catch (err) {
  compare(err, `Vertex 'a' already connected to 'b'`);
}

compare(g.numEdges(), 2);
compare(a.degree(), 1);
compare(b.degree(), 2);

compare(g.getConnection("a", "b"), a_b_edge);
compare(g.getConnection("b", "a"), null);
compare(g.getConnection("a", "c"), null);
compare(a.opposite(a_b_edge), b);

try {
  compare(a.opposite(c_b_edge), b);
} catch (err) {
  compare(err, `Edge not attached to vertex 'a'`);
}

compareArrays(a.adjacentVertices(), [b]);
compareArrays(b.adjacentVertices(), [a, c]);

const d = g.insertVertex("d");

compareArrays(d.adjacentVertices(), []);

const e = g.insertVertex("e");
const f = g.insertVertex("f");

compare(e.degree(), 0);

const [e_f_edge, f_e_edge] = g.connectTwoway("e", "f");

compare(e.degree(), 2);
compare(f.degree(), 2);

const networkMap = [{
    from: "a",
    to: "b"
  },
  {
    from: "b",
    to: "c"
  },
  {
    from: "c",
    to: "d"
  },
  {
    from: "c",
    to: "e"
  },
  {
    from: "f"
  },
  {
    from: "g"
  },
  {
    from: "e",
    to: "h"
  }
];

const network = graph.Graph.from(networkMap);

compare(network.numVertices(), 8);
compare(network.numEdges(), 5);

compare(network.getVertex("a").isIsolated(), false);
compare(network.getVertex("f").isIsolated(), true);

compare(network.getVertex("c").outgoingEdges().length, 2);
compare(network.getVertex("c").incomingEdges().length, 1);
compare(network.getVertex("c").incomingEdges().length, network.getVertex("c").indegree());
compare(network.getVertex("c").out().length, 2);

compare(network.getVertex("a") !== null, true);

compare(network.getVertex("a").depthFirstSearch("e"), network.getVertex("e"));
compare(network.getVertex("a").depthFirstSearch("f"), null);
compare(network.getVertex("f").depthFirstSearch("g"), null);
compare(network.getVertex("f").depthFirstSearch("f"), network.getVertex("f"));

compare(network.getVertex("a").breadthFirstSearch("e"), network.getVertex("e"));
compare(network.getVertex("a").breadthFirstSearch("f"), null);
compare(network.getVertex("f").breadthFirstSearch("g"), null);
compare(network.getVertex("f").breadthFirstSearch("f"), network.getVertex("f"));

const DFTKeys = [];
network.getVertex("a").depthFirstTraversal(v => DFTKeys.push(v.key));
compareArrays(DFTKeys, ["a", "b", "c", "e", "h", "d"]);

const BFTKeys = [];
network.getVertex("a").breadthFirstTraversal(v => BFTKeys.push(v.key));
compareArrays(BFTKeys, ["a", "b", "c", "d", "e", "h"]);

compare(network.generateMap().length, networkMap.length);

const testNetwork = graph.Graph.from([{
    from: "a",
    to: "b"
  },
  {
    from: "b",
    to: "c"
  },
  {
    from: "a",
    to: "c"
  },
  {
    from: "c",
    to: "d"
  }
]);

compare(testNetwork.numVertices(), 4);
compare(testNetwork.numEdges(), 4);
compare(testNetwork.getVertex("c").outgoingEdges().length, 1);
compare(testNetwork.getVertex("c").outgoingEdges().length, testNetwork.getVertex("c").outdegree());
compare(testNetwork.getVertex("c").out().length, 1);
compare(testNetwork.getVertex("a").isSource(), true);
compare(testNetwork.getVertex("a").isSink(), false);
compare(testNetwork.getVertex("c").isLeaf(), false);
compare(testNetwork.getVertex("d").isLeaf(), true);
compare(testNetwork.getVertex("d").isSink(), true);

testNetwork.removeVertex("d");

compare(testNetwork.numVertices(), 3);
compare(testNetwork.numEdges(), 3);
compare(testNetwork.getVertex("c").outdegree(), 0);
compare(testNetwork.getVertex("c").out().length, 0);


const testy = new graph.Graph();
testy.insertVertex("p");
testy.connectOneway("p", "p");

compare(testy.numVertices(), 1);
compare(testy.numEdges(), 1);

testy.removeVertex("p");

compare(testy.numVertices(), 0);
compare(testy.numEdges(), 0);

const universalTest = graph.Graph.from([{
    from: "a",
    to: "b"
  },
  {
    from: "a",
    to: "c"
  },
  {
    from: "a",
    to: "d"
  },
  {
    from: "a",
    to: "e"
  }
]);

compare(universalTest.isUniversalVertex("a"), true);
compare(universalTest.isUniversalVertex("b"), false);
compare(universalTest.isUniversalVertex("c"), false);
compare(universalTest.isUniversalVertex("d"), false);
compare(universalTest.isUniversalVertex("e"), false);

const connectedTest = graph.Graph.from([{
    from: "a",
    to: "b"
  },
  {
    from: "b",
    to: "c"
  },
  {
    from: "c",
    to: "h"
  },
  {
    from: "c",
    to: "i"
  },
  {
    from: "d",
    to: "e"
  },
  {
    from: "e",
    to: "f"
  },
  {
    from: "g"
  }
]);

const components = connectedTest.getWeaklyConnectedComponents();

compare(components.length, 2);
compare(components[0].length, 5);
compare(components[1].length, 3);

compare(graph.Iterator.findPath(connectedTest.getVertex("a"), "e"), null);
compare(graph.Iterator.findPath(connectedTest.getVertex("a"), "h").length, 4);

// const bigGraph = new graph.Graph();

// for (let i = 0; i < 25000; i++) {
//   const vertices = bigGraph.getVertices();

//   const newVertex = bigGraph.insertVertex(i.toString());

//   if (vertices.length && Math.random() > 0) {
//     const randomVertex = vertices[Math.floor(Math.random() * vertices.length)];
//     bigGraph.connectTwoway(newVertex.getKey(), randomVertex.getKey());
//   }
// }

// console.log(new Date());
// //console.log(`Components: `, bigGraph.getStronglyConnectedComponents());
// //console.log(bigGraph.getWeaklyConnectedComponents());

// //console.log(bigGraph.getVertex("0").breadthFirstSearch("40000"));

// // console.log(graph.Iterator.findPath(bigGraph.getVertex("0"), "12500").map(v => v.getKey()));

// console.log(new Date());