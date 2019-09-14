import { Vertex } from "./vertex";

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