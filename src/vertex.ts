import { Edge } from "./edge";
import { HashMap } from "./util";
import { Iterator } from "./iterator";

export class Vertex {
  protected key: string;
  protected edges: Edge[] = [];

  constructor(key: string) {
    this.key = key;
  }

  getKey() {
    return this.key;
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
    return this.edges.map(edge => this.opposite(edge))
  }

  protected search(searchKey: string, traversal: (start: Vertex, undirected?: boolean) => Generator<Vertex, void, unknown>, undirected?: boolean): Vertex | null {
    let iterator = traversal(this, undirected);
    let v: Vertex | void;

    while (true) {
      v = iterator.next().value;

      if (!v) {
        return null;
      }

      if (v.getKey() == searchKey) {
        return v;
      }
    }
  }

  depthFirstSearch(searchKey: string, undirected?: boolean): Vertex | null {
    return this.search(searchKey, Iterator.depthFirstTraversal, undirected);
  }

  breadthFirstSearch(searchKey: string, undirected?: boolean): Vertex | null {
    return this.search(searchKey, Iterator.breadthFirstTraversal, undirected);
  }

  depthFirstTraversal(onVisit: (v: Vertex) => boolean | undefined): void {
    let iterator = Iterator.depthFirstTraversal(this);

    let v: Vertex | void;
    let cont = true;

    while (cont) {
      v = iterator.next().value;

      if (!v || onVisit(v) === true)
        cont = false;
    }
  }

  breadthFirstTraversal(onVisit: (v: Vertex) => boolean | undefined): void {
    let iterator = Iterator.breadthFirstTraversal(this);

    let v: Vertex | void;
    let cont = true;

    while (cont) {
      v = iterator.next().value;

      if (!v || onVisit(v) === true)
        cont = false;
    }
  }
}