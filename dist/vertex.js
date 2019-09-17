"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterator_1 = require("./iterator");
class Vertex {
    constructor(key) {
        this.edges = [];
        this.key = key;
    }
    getKey() {
        return this.key;
    }
    removeEdge(edge) {
        if (!!this.edges.find(e => e === edge)) {
            this.edges = this.edges.filter(e => e !== edge);
            const opposite = this.opposite(edge);
            opposite.removeEdge(edge);
        }
    }
    addEdge(edge) {
        this.edges.push(edge);
    }
    isSource() {
        return this.indegree() === 0;
    }
    isSink() {
        return this.outdegree() === 0;
    }
    isLeaf() {
        return this.edges.length === 1;
    }
    isIsolated() {
        return this.edges.length === 0;
    }
    indegree() {
        return this.incomingEdges().length;
    }
    outdegree() {
        return this.outgoingEdges().length;
    }
    degree() {
        return this.edges.length;
    }
    in(label) {
        return this.incomingEdges(label).map(e => e.getStart());
    }
    out(label) {
        return this.outgoingEdges(label).map(e => e.getEnd());
    }
    incomingEdges(label) {
        let incoming = this
            .incidentEdges()
            .filter(e => e.getEnd().key == this.key);
        if (label) {
            incoming = incoming.filter(e => e.getLabel() == label);
        }
        return incoming;
    }
    outgoingEdges(label) {
        let outgoing = this
            .incidentEdges()
            .filter(e => e.getStart().key == this.key);
        if (label) {
            outgoing = outgoing.filter(e => e.getLabel() == label);
        }
        return outgoing;
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
        return this.edges.map(edge => this.opposite(edge));
    }
    search(searchKey, traversal, undirected) {
        let iterator = traversal(this, undirected);
        let v;
        while (true) {
            v = iterator.next().value;
            if (!v) {
                return null;
            }
            if (v.getKey() == searchKey) {
                return v;
            }
        }
    }
    depthFirstSearch(searchKey, undirected) {
        return this.search(searchKey, iterator_1.Iterator.depthFirstTraversal, undirected);
    }
    breadthFirstSearch(searchKey, undirected) {
        return this.search(searchKey, iterator_1.Iterator.breadthFirstTraversal, undirected);
    }
    depthFirstTraversal(onVisit) {
        let iterator = iterator_1.Iterator.depthFirstTraversal(this);
        let v;
        let cont = true;
        while (cont) {
            v = iterator.next().value;
            if (!v || onVisit(v) === true)
                cont = false;
        }
    }
    breadthFirstTraversal(onVisit) {
        let iterator = iterator_1.Iterator.breadthFirstTraversal(this);
        let v;
        let cont = true;
        while (cont) {
            v = iterator.next().value;
            if (!v || onVisit(v) === true)
                cont = false;
        }
    }
}
exports.Vertex = Vertex;
