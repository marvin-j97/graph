"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Edge {
    constructor(s, t, label, weight) {
        this.label = null;
        this.weight = 1;
        this.start = s;
        this.end = t;
        this.label = label || null;
        if (weight !== undefined)
            this.setWeight(weight);
    }
    setWeight(weight) {
        if (weight && weight <= 0)
            throw "Edge weight cannot be less or equal 0";
        this.weight = weight || 1;
    }
    getWeight() {
        return this.weight;
    }
    getLabel() {
        return this.label;
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
