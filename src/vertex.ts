import { Edge } from "./edge";
import { HashMap } from "./util";

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