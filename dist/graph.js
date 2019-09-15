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
    removeVertex(key) {
        const vertex = this.getVertex(key);
        if (vertex) {
            delete this.vertices[key];
            this._numVertices--;
            const edges = vertex.incidentEdges();
            for (const edge of edges) {
                vertex.removeEdge(edge);
                this.edges = this.edges.filter(e => e !== edge);
                this._numEdges--;
            }
        }
    }
    generateMap() {
        const map = [];
        for (const edge of this.getEdges()) {
            map.push({
                from: edge.getStart().key,
                to: edge.getEnd().key,
                label: edge.getLabel() || undefined,
                weight: edge.getWeight()
            });
        }
        for (const vertex of this.getVertices()) {
            if (vertex.degree() === 0) {
                map.push({ from: vertex.key });
            }
        }
        return map;
    }
    static from(map) {
        const g = new Graph();
        const vertexExists = (key) => !!g.getVertex(key);
        for (const c of map) {
            if (!vertexExists(c.from))
                g.insertVertex(c.from);
            if (c.to) {
                if (!vertexExists(c.to))
                    g.insertVertex(c.to);
                g.connectOneway(c.from, c.to, c.label, c.weight);
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
    isUniversalVertex(key) {
        const vertex = this.getVertex(key);
        if (!vertex)
            throw `Vertex '${key}' not in graph`;
        return (vertex.adjacentVertices().length === this.numVertices() - 1);
    }
    insertVertex(key) {
        if (!!this.getVertex(key))
            throw `Vertex '${key}' already in graph`;
        const vertex = new vertex_1.Vertex(key);
        this.vertices[key] = vertex;
        this._numVertices++;
        return vertex;
    }
    connectOneway(start, end, label, weight) {
        const a = this.getVertex(start);
        if (!a)
            throw `Vertex '${start}' not found`;
        const b = this.getVertex(end);
        if (!b)
            throw `Vertex '${end}' not found`;
        if (a.out().find(v => v.key === end))
            throw `Vertex '${start}' already connected to '${end}'`;
        const edge = new edge_1.Edge(a, b, label, weight);
        a.addEdge(edge);
        if (a !== b)
            b.addEdge(edge);
        this.edges.push(edge);
        this._numEdges++;
        return edge;
    }
    connectTwoway(start, end, label, weight) {
        const edgeOne = this.connectOneway(start, end, label, weight);
        const edgeTwo = this.connectOneway(end, start, label, weight);
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
