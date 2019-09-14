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

const networkMap = [
  ["a", "b"],
  ["b", "c"],
  ["c", "d"],
  ["c", "e"],
  ["f"],
  ["g"],
  ["e", "h"]
];

const network = graph.Graph.from(networkMap);

compare(network.numVertices(), 8);
compare(network.numEdges(), 5);

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
