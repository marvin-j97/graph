import { Vertex } from "./vertex";
import { Edge } from "./edge";
import { HashMap } from "./util";
declare type VertexMap = HashMap<Vertex>;
export declare class Graph {
    protected vertices: VertexMap;
    private _numVertices;
    protected edges: Edge[];
    private _numEdges;
    removeVertex(key: string): void;
    generateMap(): {
        from: string;
        to?: string | undefined;
        label?: string | undefined;
        weight?: number | undefined;
    }[];
    static from(map: {
        from: string;
        to?: string;
        label?: string;
        weight?: number;
    }[]): Graph;
    numVertices(): number;
    numEdges(): number;
    getVertex(key: string): Vertex | null;
    getVertices(): Vertex[];
    getEdges(): Edge[];
    isUniversalVertex(key: string): boolean;
    insertVertex(key: string): Vertex;
    connectOneway(start: string, end: string, label?: string, weight?: number): Edge;
    connectTwoway(start: string, end: string, label?: string, weight?: number): [Edge, Edge];
    getConnection(start: string, end: string): Edge | null;
}
export {};
