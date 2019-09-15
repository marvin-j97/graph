import { Edge } from "./edge";
export declare class Vertex {
    readonly key: string;
    protected edges: Edge[];
    constructor(key: string);
    removeEdge(edge: Edge): void;
    addEdge(edge: Edge): void;
    isSource(): boolean;
    isSink(): boolean;
    isLeaf(): boolean;
    isIsolated(): boolean;
    indegree(): number;
    outdegree(): number;
    degree(): number;
    in(label?: string): Vertex[];
    out(label?: string): Vertex[];
    incomingEdges(label?: string): Edge[];
    outgoingEdges(label?: string): Edge[];
    incidentEdges(): Edge[];
    opposite(edge: Edge): Vertex;
    adjacentVertices(): Vertex[];
    depthFirstSearch(searchKey: string): Vertex | null;
    breadthFirstSearch(searchKey: string): Vertex | null;
    depthFirstTraversal(func: (v: Vertex) => void): null;
    breadthFirstTraversal(func: (v: Vertex) => void): Vertex | null;
}
