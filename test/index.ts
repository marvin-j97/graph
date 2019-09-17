import { expect } from 'chai';
import 'mocha';
import { Graph, Edge, Iterator, Vertex } from "../src/index";

describe('General', () => {
  it('Graph with 3 vertices', () => {
    const g = new Graph();

    const a = g.insertVertex("a");
    const b = g.insertVertex("b");
    const c = g.insertVertex("c");

    expect(g.getVertices()).to.have.length(3);
    expect(g.getEdges()).to.have.length(0);
    expect(a.degree()).to.equal(0);
    expect(a.isIsolated()).to.equal(true);
    expect(b.degree()).to.equal(0);
    expect(b.isIsolated()).to.equal(true);
    expect(c.degree()).to.equal(0);
    expect(c.isIsolated()).to.equal(true);
    expect(a.incidentEdges()).to.have.length(0);
    expect(b.incidentEdges()).to.have.length(0);
    expect(c.incidentEdges()).to.have.length(0);
  });

  it('Connect vertices one-way', () => {
    const g = new Graph();

    const a = g.insertVertex("a");
    const b = g.insertVertex("b");
    const c = g.insertVertex("c");

    expect(a.adjacentVertices()).to.deep.equal([]);
    expect(b.adjacentVertices()).to.deep.equal([]);
    expect(c.adjacentVertices()).to.deep.equal([]);

    const a_b_edge = g.connectOneway("a", "b");
    const c_b_edge = g.connectOneway("c", "b");

    expect(a.outgoingEdges()).to.have.length(1);
    expect(a.out()).to.have.length(1);

    expect(b.outgoingEdges()).to.have.length(0);
    expect(b.out()).to.have.length(0);

    expect(b.incomingEdges()).to.have.length(2);
    expect(b.in()).to.have.length(2);

    expect(b.isSink()).to.equal(true);
    expect(a.isSource()).to.equal(true);

    expect(a.opposite(a_b_edge)).to.equal(b);
    expect(b.opposite(c_b_edge)).to.equal(c);

    try {
      g.connectOneway("a", "b");
    } catch (err) {
      expect(err).to.equal(`Vertex 'a' already connected to 'b'`);
    }

    expect(g.numEdges()).to.equal(2);
    expect(a.degree()).to.equal(1);
    expect(b.degree()).to.equal(2);

    expect(g.getEdge("a", "b")).to.equal(a_b_edge);
    expect(g.getEdge("b", "a")).to.equal(null);
    expect(g.getEdge("a", "c")).to.equal(null);
    expect(a.opposite(a_b_edge)).to.equal(b);
    expect(b.opposite(a_b_edge)).to.equal(a);

    try {
      a.opposite(c_b_edge);
    } catch (err) {
      expect(err).to.equal(`Edge not attached to vertex 'a'`);
    }

    expect(a.adjacentVertices()).to.deep.equal([b]);
    expect(b.adjacentVertices()).to.deep.equal([a, c]);
  })

  it('Two-way connection', () => {
    const g = new Graph();

    const e = g.insertVertex("e");
    const f = g.insertVertex("f");

    const [e_f_edge, f_e_edge] = g.connectTwoway("e", "f");

    expect(e.degree()).to.equal(2);
    expect(f.degree()).to.equal(2);
  })

  it('Remove edge', () => {
    const g = Graph.from([{
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
    }
    ]);

    const a = g.getVertex("a");
    const b = g.getVertex("b");

    if (!a || !b)
      return;

    expect(g.numVertices()).to.equal(4);
    expect(g.numEdges()).to.equal(3);
    expect(b.incidentEdges().length).to.equal(2);

    const a_b_edge = g.getEdge("a", "b");

    expect(a_b_edge).to.not.equal(null);

    if (!a_b_edge)
      return;

    g.removeEdge(a_b_edge);

    expect(g.numVertices()).to.equal(4);
    expect(g.numEdges()).to.equal(2);

    expect(a.incidentEdges().length).to.equal(0);
    expect(b.incidentEdges().length).to.equal(1);
  })

  it('Network generation', () => {
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

    const g = Graph.from(networkMap);

    expect(g.numVertices()).to.equal(8);
    expect(g.numEdges()).to.equal(5);

    const a = g.getVertex("a");
    const f = g.getVertex("f");
    const c = g.getVertex("c");
    const h = g.getVertex("h");

    expect(a).to.not.equal(null);
    expect(f).to.not.equal(null);
    expect(c).to.not.equal(null);
    expect(h).to.not.equal(null);

    if (!a || !f || !c || !h)
      return;

    expect(a.isIsolated()).to.equal(false);
    expect(f.isIsolated()).to.equal(true);

    expect(c.outgoingEdges()).to.have.length(2);
    expect(c.incomingEdges()).to.have.length(1);
    expect(c.incomingEdges()).to.have.length(c.indegree());
    expect(c.out()).to.have.length(2);
    expect(h.isLeaf()).to.equal(true);

    expect(g.generateMap()).to.have.length(networkMap.length);
  })

  it('Universal vertex', () => {
    const g = Graph.from([{
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

    expect(g.isUniversalVertex("a")).to.equal(true);
    expect(g.isUniversalVertex("b")).to.equal(false);
    expect(g.isUniversalVertex("c")).to.equal(false);
    expect(g.isUniversalVertex("d")).to.equal(false);
    expect(g.isUniversalVertex("e")).to.equal(false);
  })
});

describe('Traversal, search & pathfinding', () => {
  it('DFT', () => {
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
    }];

    const g = Graph.from(networkMap);

    const a = g.getVertex("a");

    if (!a)
      return;

    const DFTKeys = [] as string[];

    a.depthFirstTraversal(v => {
      DFTKeys.push(v.getKey());
      return false;
    });
    expect(DFTKeys).to.deep.equal(["a", "b", "c", "e", "h", "d"]);
  })

  it('BFT', () => {
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
    }];

    const g = Graph.from(networkMap);

    const a = g.getVertex("a");

    if (!a)
      return;

    const BFTKeys = [] as string[];

    a.breadthFirstTraversal(v => {
      BFTKeys.push(v.getKey());
      return false;
    });
    expect(BFTKeys).to.deep.equal(["a", "b", "c", "d", "e", "h"]);
  })

  it('DFS', () => {
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
    }];

    const g = Graph.from(networkMap);

    const a = g.getVertex("a");
    const b = g.getVertex("b");
    const f = g.getVertex("f");

    if (!a || !b || !f)
      return;

    expect(a.depthFirstSearch("b")).to.equal(g.getVertex("b"));
    expect(b.depthFirstSearch("a")).to.equal(null);
    expect(b.depthFirstSearch("a", true)).to.equal(a);
    expect(a.depthFirstSearch("e")).to.equal(g.getVertex("e"));
    expect(a.depthFirstSearch("f")).to.equal(null);
    expect(f.depthFirstSearch("g")).to.equal(null);
    expect(f.depthFirstSearch("f")).to.equal(g.getVertex("f"));
  })

  it('BFS', () => {
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
    }];

    const g = Graph.from(networkMap);

    const a = g.getVertex("a");
    const b = g.getVertex("b");
    const f = g.getVertex("f");

    if (!a || !b || !f)
      return;

    expect(a.breadthFirstSearch("b")).to.equal(g.getVertex("b"));
    expect(b.breadthFirstSearch("a")).to.equal(null);
    expect(b.breadthFirstSearch("a", true)).to.equal(a);
    expect(a.breadthFirstSearch("e")).to.equal(g.getVertex("e"));
    expect(a.breadthFirstSearch("f")).to.equal(null);
    expect(f.breadthFirstSearch("g")).to.equal(null);
    expect(f.breadthFirstSearch("f")).to.equal(g.getVertex("f"));
  })
});