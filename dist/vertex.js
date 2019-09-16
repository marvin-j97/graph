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
        let adjacents = [];
        for (const edge of this.edges) {
            adjacents.push(this.opposite(edge));
        }
        return adjacents;
    }
    search(searchKey, traversal) {
        let vertex = null;
        traversal(this, v => {
            if (v.key == searchKey) {
                vertex = v;
                return true;
            }
        });
        return vertex;
    }
    depthFirstSearch(searchKey) {
        return this.search(searchKey, iterator_1.Iterator.depthFirstTraversal);
    }
    breadthFirstSearch(searchKey) {
        return this.search(searchKey, iterator_1.Iterator.breadthFirstTraversal);
    }
    depthFirstTraversal(onVisit) {
        return iterator_1.Iterator.depthFirstTraversal(this, onVisit);
    }
    breadthFirstTraversal(onVisit) {
        return iterator_1.Iterator.breadthFirstTraversal(this, onVisit);
    }
}
exports.Vertex = Vertex;
