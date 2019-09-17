const graph = require("../dist/index");

function compare(actual, expected) {
  console.log(actual === expected ? 'Test passed.' : `${actual} differed from expected value: ${expected}`);
}

function compareArrays(actual, expected) {
  const sameLength = actual.length == expected.length;
  console.log((sameLength && actual.every((v, i) => v === expected[i])) ? 'Test passed.' : `Array ${actual} differed from expected array ${expected}`);
}

const g = new graph.Graph();

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

