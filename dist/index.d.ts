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
export declare class Edge {
    protected start: Vertex;
    protected end: Vertex;
    constructor(s: Vertex, t: Vertex);
    getStart(): Vertex;
    getEnd(): Vertex;
    endVertices(): [Vertex, Vertex];
}
interface HashMap<T> {
    [key: string]: T;
}
declare type VertexMap = HashMap<Vertex>;
export declare class Graph {
    protected vertices: VertexMap;
    protected edges: Edge[];
    static from(nodes: [string, string | undefined][]): Graph;
    getVertex(key: string): Vertex | null;
    numVertices(): number;
    getVertices(): Vertex[];
    numEdges(): number;
    getEdges(): Edge[];
    insertVertex(key: string): Vertex;
    connectOneway(start: string, end: string): Edge;
    connectTwoway(start: string, end: string): [Edge, Edge];
    getConnection(start: string, end: string): Edge | null;
}
export {};
