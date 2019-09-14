"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vertex {
    constructor(key) {
        this.edges = [];
        this.key = key;
    }
    addEdge(edge) {
        this.edges.push(edge);
    }
    degree() {
        return this.edges.length;
    }
    out() {
        return this.outgoingEdges().map(e => e.getEnd());
    }
    outgoingEdges() {
        return this
            .incidentEdges()
            .filter(e => e.getStart().key == this.key);
    }
    incidentEdges() {
        return this.edges.slice();
    }
    opposite(edge) {
        if (edge.getStart() === this)
            return edge.getEnd();
        else if (edge.getEnd() == this)
            return edge.getStart();
        throw `Edge not attached to vertex '${this.key}'`;
    }
    adjacentVertices() {
        let adjacents = [];
        for (const edge of this.edges) {
            adjacents.push(this.opposite(edge));
        }
        return adjacents;
    }
    depthFirstSearch(searchKey) {
        const stack = [this];
        const visited = {};
        const hasBeenVisited = (key) => visited[key] === true;
        while (!!stack.length) {
            const vertex = stack.pop();
            if (vertex) {
                if (vertex.key == searchKey)
                    return vertex;
                if (!hasBeenVisited(vertex.key)) {
                    visited[vertex.key] = true;
                    stack.push(...vertex.out());
                }
            }
        }
        return null;
    }
    breadthFirstSearch(searchKey) {
        const queue = [this];
        const visited = {};
        const hasBeenVisited = (key) => visited[key] === true;
        visited[this.key] = true;
        while (!!queue.length) {
            const vertex = queue.shift();
            if (vertex) {
                if (vertex.key === searchKey)
                    return vertex;
                for (const other of vertex.out()) {
                    if (!hasBeenVisited(other.key)) {
                        visited[other.key] = true;
                        queue.push(other);
                    }
                }
            }
        }
        return null;
    }
    depthFirstTraversal(func) {
        const stack = [this];
        const visited = {};
        const hasBeenVisited = (key) => visited[key] === true;
        while (!!stack.length) {
            const vertex = stack.pop();
            if (vertex) {
                func(vertex);
                if (!hasBeenVisited(vertex.key)) {
                    visited[vertex.key] = true;
                    stack.push(...vertex.out());
                }
            }
        }
        return null;
    }
    breadthFirstTraversal(func) {
        const queue = [this];
        const visited = {};
        const hasBeenVisited = (key) => visited[key] === true;
        visited[this.key] = true;
        while (!!queue.length) {
            const vertex = queue.shift();
            if (vertex) {
                func(vertex);
                for (const other of vertex.out()) {
                    if (!hasBeenVisited(other.key)) {
                        visited[other.key] = true;
                        queue.push(other);
                    }
                }
            }
        }
        return null;
    }
}
exports.Vertex = Vertex;
