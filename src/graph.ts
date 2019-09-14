import { Vertex } from "./vertex";
import { Edge } from "./edge";
import { HashMap } from "./util";

type VertexMap = HashMap<Vertex>;

export class Graph {
  protected vertices: VertexMap = {};
  private _numVertices = 0;
  protected edges: Edge[] = [];
  private _numEdges = 0;

  generateMap() {
    const map = [] as [string, string | undefined][];

    for (const edge of this.getEdges()) {
      map.push([edge.getStart().key, edge.getEnd().key]);
    }

    for (const vertex of this.getVertices()) {
      if (vertex.degree() === 0) {
        map.push([vertex.key, undefined]);
      }
    }

    return map;
  }

  static from(map: [string, string | undefined][]): Graph {
    const g = new Graph();

    const vertexExists = (key: string) => !!g.getVertex(key);

    for (const [start, end] of map) {
      if (!vertexExists(start))
        g.insertVertex(start);

      if (end) {
        if (!vertexExists(end))
          g.insertVertex(end);

        g.connectOneway(start, end);
      }
    }

    return g;
  }

  numVertices() {
    return this._numVertices;
  }

  numEdges() {
    return this._numEdges;
  }

  getVertex(key: string): Vertex | null {
    return this.vertices[key] || null;
  }

  getVertices(): Vertex[] {
    return Object.values(this.vertices).slice();
  }

  getEdges(): Edge[] {
    return this.edges.slice();
  }

  insertVertex(key: string): Vertex {
    if (!!this.getVertex(key))
      throw `Vertex '${key}' already in graph`;

    const vertex = new Vertex(key);
    this.vertices[key] = vertex;
    this._numVertices++;
    return vertex;
  }

  connectOneway(start: string, end: string): Edge {
    const a = this.getVertex(start);

    if (!a)
      throw `Vertex '${start}' not found`;

    const b = this.getVertex(end);

    if (!b)
      throw `Vertex '${end}' not found`;

    if (a.out().find(v => v.key === end))
      throw `Vertex '${start}' already connected to '${end}'`;

    const edge = new Edge(a, b);

    a.addEdge(edge);
    b.addEdge(edge);
    this.edges.push(edge);
    this._numEdges++;
    return edge;
  }

  connectTwoway(start: string, end: string): [Edge, Edge] {
    const edgeOne = this.connectOneway(start, end);
    const edgeTwo = this.connectOneway(end, start);
    return [edgeOne, edgeTwo];
  }

  getConnection(start: string, end: string): Edge | null {
    const a = this.getVertex(start);

    if (!a)
      throw `Vertex '${start}' not found`;

    const b = this.getVertex(end);

    if (!b)
      throw `Vertex '${end}' not found`;

    const edges = a
      .incidentEdges()
      .filter(edge => edge.getStart() == a && edge.getEnd() == b);

    return edges[0] || null;
  }
}