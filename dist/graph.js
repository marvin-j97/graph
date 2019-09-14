"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vertex_1 = require("./vertex");
const edge_1 = require("./edge");
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
        const vertex = new vertex_1.Vertex(key);
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
        const edge = new edge_1.Edge(a, b);
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
