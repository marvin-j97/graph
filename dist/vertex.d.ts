import { Edge } from "./edge";
export declare class Vertex {
    readonly key: string;
    protected edges: Edge[];
    constructor(key: string);
    addEdge(edge: Edge): void;
    degree(): number;
    out(): Vertex[];
    outgoingEdges(): Edge[];
    incidentEdges(): Edge[];
    opposite(edge: Edge): Vertex;
    adjacentVertices(): Vertex[];
    depthFirstSearch(searchKey: string): Vertex | null;
    breadthFirstSearch(searchKey: string): Vertex | null;
    depthFirstTraversal(func: (v: Vertex) => void): null;
    breadthFirstTraversal(func: (v: Vertex) => void): Vertex | null;
}
