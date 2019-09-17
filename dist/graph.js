"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vertex_1 = require("./vertex");
const edge_1 = require("./edge");
const iterator_1 = require("./iterator");
class Graph {
    constructor() {
        this.vertices = {};
        this._numVertices = 0;
        this.edges = [];
        this._numEdges = 0;
    }
    getWeaklyConnectedComponents() {
        const vertices = this.getVertices();
        const components = [];
        for (const start of vertices) {
            if (components.some(component => component.includes(start)))
                continue;
            const connectedVertices = [];
            const iterator = iterator_1.Iterator.breadthFirstTraversal(start);
            let v;
            while (true) {
                v = iterator.next().value;
                if (!v) {
                    break;
                }
                connectedVertices.push(v);
            }
            if (connectedVertices.length > 1)
                components.push(connectedVertices);
        }
        return components;
    }
    removeEdge(edge) {
        const vertex = this.getVertex(edge.getStart().getKey());
        if (vertex) {
            this.edges = this.edges.filter(e => e !== edge);
            vertex.removeEdge(edge);
            this._numEdges--;
        }
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
                from: edge.getStart().getKey(),
                to: edge.getEnd().getKey(),
                label: edge.getLabel() || undefined,
                weight: edge.getWeight()
            });
        }
        for (const vertex of this.getVertices()) {
            if (vertex.degree() === 0) {
                map.push({ from: vertex.getKey() });
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
    get(key) {
        return this.getVertex(key);
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
        if (a.out().find(v => v.getKey() === end))
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
    getEdge(start, end) {
        const a = this.getVertex(start);
        if (!a)
            throw `Vertex '${start}' not found`;
        const b = this.getVertex(end);
        if (!b)
            throw `Vertex '${end}' not found`;
        const edge = a
            .outgoingEdges()
            .find(edge => edge.getEnd() == b);
        return edge || null;
    }
}
exports.Graph = Graph;
