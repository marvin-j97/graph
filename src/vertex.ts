import { Edge } from "./edge";
import { HashMap } from "./util";

export class Vertex {
  readonly key: string;
  protected edges: Edge[] = [];

  constructor(key: string) {
    this.key = key;
  }

  removeEdge(edge: Edge) {
    if (!!this.edges.find(e => e === edge)) {
      this.edges = this.edges.filter(e => e !== edge);
      const opposite = this.opposite(edge);
      opposite.removeEdge(edge);
    }
  }

  addEdge(edge: Edge): void {
    this.edges.push(edge);
  }

  isSource(): boolean {
    return this.indegree() === 0;
  }

  isSink(): boolean {
    return this.outdegree() === 0;
  }

  isLeaf(): boolean {
    return this.edges.length === 1;
  }

  isIsolated(): boolean {
    return this.edges.length === 0;
  }

  indegree(): number {
    return this.incomingEdges().length;
  }

  outdegree(): number {
    return this.outgoingEdges().length;
  }

  degree(): number {
    return this.edges.length;
  }

  in(label?: string): Vertex[] {
    return this.incomingEdges(label).map(e => e.getStart());
  }

  out(label?: string): Vertex[] {
    return this.outgoingEdges(label).map(e => e.getEnd());
  }

  incomingEdges(label?: string): Edge[] {
    let incoming = this
      .incidentEdges()
      .filter(e => e.getEnd().key == this.key);

    if (label) {
      incoming = incoming.filter(e => e.getLabel() == label);
    }

    return incoming;
  }

  outgoingEdges(label?: string): Edge[] {
    let outgoing = this
      .incidentEdges()
      .filter(e => e.getStart().key == this.key);

    if (label) {
      outgoing = outgoing.filter(e => e.getLabel() == label);
    }

    return outgoing;
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