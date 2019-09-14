import { Vertex } from "./vertex";
import { Edge } from "./edge";
import { HashMap } from "./util";
declare type VertexMap = HashMap<Vertex>;
export declare class Graph {
    protected vertices: VertexMap;
    private _numVertices;
    protected edges: Edge[];
    private _numEdges;
    generateMap(): [string, string | undefined][];
    static from(map: [string, string | undefined][]): Graph;
    numVertices(): number;
    numEdges(): number;
    getVertex(key: string): Vertex | null;
    getVertices(): Vertex[];
    getEdges(): Edge[];
    insertVertex(key: string): Vertex;
    connectOneway(start: string, end: string): Edge;
    connectTwoway(start: string, end: string): [Edge, Edge];
    getConnection(start: string, end: string): Edge | null;
}
export {};
