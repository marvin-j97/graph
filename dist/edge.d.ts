import { Vertex } from "./vertex";
export declare class Edge {
    protected start: Vertex;
    protected end: Vertex;
    protected label: string | null;
    protected weight: number;
    constructor(s: Vertex, t: Vertex, label?: string, weight?: number);
    setWeight(weight: number): void;
    getWeight(): number;
    getLabel(): string | null;
    getStart(): Vertex;
    getEnd(): Vertex;
    endVertices(): [Vertex, Vertex];
}
