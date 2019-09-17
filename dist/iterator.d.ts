import { Vertex } from "./vertex";
export declare class Iterator {
    static findPath(start: Vertex, end: string): Vertex[] | null;
    static breadthFirstTraversal(start: Vertex, undirected?: boolean): Generator<Vertex, void, unknown>;
    static depthFirstTraversal(start: Vertex, undirected?: boolean): Generator<Vertex, void, unknown>;
}
