import { Vertex } from "./vertex";

export class Edge {
  protected start: Vertex;
  protected end: Vertex;
  protected label: string | null = null;
  protected weight: number = 1;

  constructor(s: Vertex, t: Vertex, label?: string, weight?: number) {
    this.start = s;
    this.end = t;
    this.label = label || null;

    if (weight !== undefined)
      this.setWeight(weight);
  }

  setWeight(weight: number) {
    if (weight && weight <= 0)
      throw "Edge weight cannot be less or equal 0";

    this.weight = weight || 1;
  }

  getWeight() {
    return this.weight;
  }

  getLabel() {
    return this.label;
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