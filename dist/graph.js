"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vertex_1 = require("./vertex");
const edge_1 = require("./edge");
class Graph {
    constructor() {
        this.vertices = {};
        this._numVertices = 0;
        this.edges = [];
        this._numEdges = 0;
    }
    generateMap() {
        const map = [];
        for (const edge of this.getEdges()) {
            map.push([edge.getStart().key, edge.getEnd().key]);
        }
        for (const vertex of this.getVertices()) {
            if (vertex.degree() === 0) {
                map.push([vertex.key, undefined]);
            }
        }
        return map;
    }
    static from(map) {
        const g = new Graph();
        const vertexExists = (key) => !!g.getVertex(key);
        for (const [start, end] of map) {
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
    numVertices() {
        return this._numVertices;
    }
    numEdges() {
        return this._numEdges;
    }
    getVertex(key) {
        return this.vertices[key] || null;
    }
    getVertices() {
        return Object.values(this.vertices).slice();
    }
    getEdges() {
        return this.edges.slice();
    }
    insertVertex(key) {
        if (!!this.getVertex(key))
            throw `Vertex '${key}' already in graph`;
        const vertex = new vertex_1.Vertex(key);
        this.vertices[key] = vertex;
        this._numVertices++;
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
        this._numEdges++;
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
