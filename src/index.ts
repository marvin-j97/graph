export class Vertex {
  readonly key: string;
  protected edges: Edge[] = [];

  constructor(key: string) {
    this.key = key;
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  degree(): number {
    return this.edges.length;
  }

  out(): Vertex[] {
    return this.outgoingEdges().map(e => e.getEnd());
  }

  outgoingEdges(): Edge[] {
    return this
      .incidentEdges()
      .filter(e => e.getStart().key == this.key);
  }

  incidentEdges(): Edge[] {
    return this.edges.slice();
  }

  opposite(edge: Edge) {
    if (edge.getStart() === this)
      return edge.getEnd();
    else if (edge.getEnd() == this)
      return edge.getStart();

    throw `Edge not attached to vertex '${this.key}'`;
  }

  adjacentVertices(): Vertex[] {
    let adjacents: Vertex[] = [];
    for (const edge of this.edges) {
      adjacents.push(this.opposite(edge));
    }

    return adjacents;
  }

  depthFirstSearch(searchKey: string): Vertex | null {
    const stack: Vertex[] = [this];
    const visited: HashMap<boolean> = {};

    const hasBeenVisited = (key: string) => visited[key] === true;

    while (!!stack.length) {
      const vertex = stack.pop();

      if (vertex) {
        if (vertex.key == searchKey)
          return vertex;

        if (!hasBeenVisited(vertex.key)) {
          visited[vertex.key] = true;

          stack.push(...vertex.out());
        }
      }
    }
    return null;
  }

  breadthFirstSearch(searchKey: string): Vertex | null {
    const queue: Vertex[] = [this];
    const visited: HashMap<boolean> = {};

    const hasBeenVisited = (key: string) => visited[key] === true;

    visited[this.key] = true;

    while (!!queue.length) {
      const vertex = queue.shift();

      if (vertex) {
        if (vertex.key === searchKey)
          return vertex;

        for (const other of vertex.out()) {
          if (!hasBeenVisited(other.key)) {
            visited[other.key] = true;
            queue.push(other);
          }
        }
      }
    }
    return null;
  }

  depthFirstTraversal(func: (v: Vertex) => void) {
    const stack: Vertex[] = [this];
    const visited: HashMap<boolean> = {};

    const hasBeenVisited = (key: string) => visited[key] === true;

    while (!!stack.length) {
      const vertex = stack.pop();

      if (vertex) {
        func(vertex);
        if (!hasBeenVisited(vertex.key)) {
          visited[vertex.key] = true;
          stack.push(...vertex.out());
        }
      }
    }
    return null;
  }

  breadthFirstTraversal(func: (v: Vertex) => void): Vertex | null {
    const queue: Vertex[] = [this];
    const visited: HashMap<boolean> = {};

    const hasBeenVisited = (key: string) => visited[key] === true;

    visited[this.key] = true;

    while (!!queue.length) {
      const vertex = queue.shift();

      if (vertex) {
        func(vertex);
        for (const other of vertex.out()) {
          if (!hasBeenVisited(other.key)) {
            visited[other.key] = true;
            queue.push(other);
          }
        }
      }
    }
    return null;
  }
}

export class Edge {
  protected start: Vertex;
  protected end: Vertex;

  constructor(s: Vertex, t: Vertex) {
    this.start = s;
    this.end = t;
  }

  getStart() {
    return this.start;
  }

  getEnd() {
    return this.end;
  }

  endVertices(): [Vertex, Vertex] {
    return [this.start, this.end];
  }
}

interface HashMap<T> {
  [key: string]: T;
}

type VertexMap = HashMap<Vertex>;

export class Graph {
  protected vertices: VertexMap = {};
  protected edges: Edge[] = [];

  static from(nodes: [string, string | undefined][]): Graph {
    const g = new Graph();

    const vertexExists = (key: string) => !!g.getVertex(key);

    for (const [start, end] of nodes) {
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

  getVertex(key: string): Vertex | null {
    return this.vertices[key] || null;
  }

  numVertices(): number {
    return Object.keys(this.vertices).length;
  }

  getVertices(): Vertex[] {
    return Object.values(this.vertices).slice();
  }

  numEdges(): number {
    return this.edges.length;
  }

  getEdges(): Edge[] {
    return this.edges.slice();
  }

  insertVertex(key: string): Vertex {
    if (!!this.getVertex(key))
      throw `Vertex '${key}' already in graph`;

    const vertex = new Vertex(key);
    this.vertices[key] = vertex;
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