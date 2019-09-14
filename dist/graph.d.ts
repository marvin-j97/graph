import { Vertex } from "./vertex";
import { Edge } from "./edge";
import { HashMap } from "./util";
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
