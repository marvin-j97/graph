import { Vertex } from "./vertex";
import { Edge } from "./edge";
import { HashMap } from "./util";

type VertexMap = HashMap<Vertex>;

export class Graph {
  protected vertices: VertexMap = {};
  private _numVertices = 0;
  protected edges: Edge[] = [];
  private _numEdges = 0;

  removeVertex(key: string) {
    const vertex = this.getVertex(key);

    if (vertex) {
      delete this.vertices[key];
      this._numVertices--;

      const edges = vertex.incidentEdges();

      for (const edge of edges) {
        vertex.removeEdge(edge);
        this.edges = this.edges.filter(e => e !== edge);
        this._numEdges--;
      }
    }
  }

  generateMap() {
    const map = [] as { from: string, to?: string, label?: string, weight?: number }[];

    for (const edge of this.getEdges()) {
      map.push({
        from: edge.getStart().key,
        to: edge.getEnd().key,
        label: edge.getLabel() || undefined,
        weight: edge.getWeight()
      });
    }

    for (const vertex of this.getVertices()) {
      if (vertex.degree() === 0) {
        map.push({ from: vertex.key });
      }
    }

    return map;
  }

  static from(map: { from: string, to?: string, label?: string, weight?: number }[]): Graph {
    const g = new Graph();

    const vertexExists = (key: string) => !!g.getVertex(key);

    for (const c of map) {
      if (!vertexExists(c.from))
        g.insertVertex(c.from);

      if (c.to) {
        if (!vertexExists(c.to))
          g.insertVertex(c.to);

        g.connectOneway(c.from, c.to, c.label, c.weight);
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

  isUniversalVertex(key: string): boolean {
    const vertex = this.getVertex(key);
    if (!vertex)
      throw `Vertex '${key}' not in graph`;

    return (vertex.adjacentVertices().length === this.numVertices() - 1);
  }

  insertVertex(key: string): Vertex {
    if (!!this.getVertex(key))
      throw `Vertex '${key}' already in graph`;

    const vertex = new Vertex(key);
    this.vertices[key] = vertex;
    this._numVertices++;
    return vertex;
  }

  connectOneway(start: string, end: string, label?: string, weight?: number): Edge {
    const a = this.getVertex(start);

    if (!a)
      throw `Vertex '${start}' not found`;

    const b = this.getVertex(end);

    if (!b)
      throw `Vertex '${end}' not found`;

    if (a.out().find(v => v.key === end))
      throw `Vertex '${start}' already connected to '${end}'`;

    const edge = new Edge(a, b, label, weight);

    a.addEdge(edge);

    if (a !== b)
      b.addEdge(edge);

    this.edges.push(edge);
    this._numEdges++;
    return edge;
  }

  connectTwoway(start: string, end: string, label?: string, weight?: number): [Edge, Edge] {
    const edgeOne = this.connectOneway(start, end, label, weight);
    const edgeTwo = this.connectOneway(end, start, label, weight);
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