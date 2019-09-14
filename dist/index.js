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
class Graph {
    constructor() {
        this.vertices = {};
        this.edges = [];
    }
    static from(nodes) {
        const g = new Graph();
        const vertexExists = (key) => !!g.getVertex(key);
        for (const [start, end] of nodes) {
            if (!vertexExists(start))
                g.insertVertex(start);
            if (end) {
                if (!vertexExists(end))
                    g.insertVertex(end);
                g.connectOneway(start, end);
            }
        }
        return g;
    }
    getVertex(key) {
        return this.vertices[key] || null;
    }
    numVertices() {
        return Object.keys(this.vertices).length;
    }
    getVertices() {
        return Object.values(this.vertices).slice();
    }
    numEdges() {
        return this.edges.length;
    }
    getEdges() {
        return this.edges.slice();
    }
    insertVertex(key) {
        if (!!this.getVertex(key))
            throw `Vertex '${key}' already in graph`;
        const vertex = new Vertex(key);
        this.vertices[key] = vertex;
        return vertex;
    }
    connectOneway(start, end) {
        const a = this.getVertex(start);
        if (!a)
            throw `Vertex '${start}' not found`;
        const b = this.getVertex(end);
        if (!b)
            throw `Vertex '${end}' not found`;
        if (a.out().find(v => v.key === end))
            throw `Vertex '${start}' already connected to '${end}'`;
        const edge = new Edge(a, b);
        a.addEdge(edge);
        b.addEdge(edge);
        this.edges.push(edge);
        return edge;
    }
    connectTwoway(start, end) {
        const edgeOne = this.connectOneway(start, end);
        const edgeTwo = this.connectOneway(end, start);
        return [edgeOne, edgeTwo];
    }
    getConnection(start, end) {
        const a = this.getVertex(start);
        if (!a)
            throw `Vertex '${start}' not found`;
        const b = this.getVertex(end);
        if (!b)
            throw `Vertex '${end}' not found`;
        const edges = a
            .incidentEdges()
            .filter(edge => edge.getStart() == a && edge.getEnd() == b);
        return edges[0] || null;
    }
}
exports.Graph = Graph;
