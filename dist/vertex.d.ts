import { Edge } from "./edge";
export declare class Vertex {
    protected key: string;
    protected edges: Edge[];
    constructor(key: string);
    getKey(): string;
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
    protected search(searchKey: string, traversal: (start: Vertex, undirected?: boolean) => Generator<Vertex, void, unknown>, undirected?: boolean): Vertex | null;
    depthFirstSearch(searchKey: string, undirected?: boolean): Vertex | null;
    breadthFirstSearch(searchKey: string, undirected?: boolean): Vertex | null;
    depthFirstTraversal(onVisit: (v: Vertex) => boolean | undefined): void;
    breadthFirstTraversal(onVisit: (v: Vertex) => boolean | undefined): void;
}
