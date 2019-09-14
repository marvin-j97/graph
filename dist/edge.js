"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Edge {
    constructor(s, t) {
        this.start = s;
        this.end = t;
    }
    getStart() {
        return this.start;
    }
    getEnd() {
        return this.end;
    }
    endVertices() {
        return [this.start, this.end];
    }
}
exports.Edge = Edge;
