import { Vertex } from "./vertex";
export declare class Iterator {
    static AStar(start: Vertex, end: string): Vertex[] | null;
    static breadthFirstTraversal(start: Vertex, onVisit?: (v: Vertex) => boolean | void, undirected?: boolean): void;
    static depthFirstTraversal(start: Vertex, onVisit?: (v: Vertex) => boolean | void, undirected?: boolean): void;
}
