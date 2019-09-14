import { Vertex } from "./vertex";
export declare class Edge {
    protected start: Vertex;
    protected end: Vertex;
    constructor(s: Vertex, t: Vertex);
    getStart(): Vertex;
    getEnd(): Vertex;
    endVertices(): [Vertex, Vertex];
}
