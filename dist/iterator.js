"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function reconstructPath(cameFrom, current) {
    let totalPath = [current];
    while (Object.keys(cameFrom).includes(current.getKey())) {
        current = cameFrom[current.getKey()];
        totalPath.unshift(current);
    }
    return totalPath;
}
class Iterator {
    static AStar(start, end) {
        let openSet = [start];
        const cameFrom = {};
        let gScore = {};
        gScore[start.getKey()] = 0;
        let fScore = {};
        fScore[start.getKey()] = 0;
        const closedSet = [];
        let current = null;
        while (openSet.length) {
            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) {
                if (fScore[openSet[i].getKey()] < fScore[openSet[lowestIndex].getKey()]) {
                    lowestIndex = i;
                }
            }
            current = openSet[lowestIndex];
            if (current.getKey() == end) {
                return reconstructPath(cameFrom, current);
            }
            openSet = openSet.filter(v => v != current);
            closedSet.push(current);
            for (const edge of current.outgoingEdges()) {
                const neighbor = edge.getEnd();
                if (closedSet.includes(neighbor))
                    continue;
                let tentative = gScore[current.getKey()] + edge.getWeight();
                if (tentative < (gScore[neighbor.getKey()] || Infinity)) {
                    cameFrom[neighbor.getKey()] = current;
                    gScore[neighbor.getKey()] = tentative;
                    fScore[neighbor.getKey()] = gScore[neighbor.getKey()];
                    if (!openSet.includes(neighbor))
                        openSet.push(neighbor);
                }
            }
        }
        return null;
    }
    static breadthFirstTraversal(start, onVisit, undirected) {
        const queue = [start];
        const visited = {};
        const hasBeenVisited = (key) => visited[key] === true;
        visited[start.getKey()] = true;
        while (!!queue.length) {
            const vertex = queue.shift();
            if (vertex) {
                if (onVisit && onVisit(vertex) === true)
                    return;
                const connectedVertices = (undirected === true) ? vertex.adjacentVertices() : vertex.out();
                for (const other of connectedVertices) {
                    if (!hasBeenVisited(other.getKey())) {
                        visited[other.getKey()] = true;
                        queue.push(other);
                    }
                }
            }
        }
    }
    static depthFirstTraversal(start, onVisit, undirected) {
        const stack = [start];
        const visited = {};
        const hasBeenVisited = (key) => visited[key] === true;
        while (!!stack.length) {
            const vertex = stack.pop();
            if (vertex) {
                if (onVisit && onVisit(vertex) === true)
                    return;
                const connectedVertices = (undirected === true) ? vertex.adjacentVertices() : vertex.out();
                if (!hasBeenVisited(vertex.getKey())) {
                    visited[vertex.getKey()] = true;
                    stack.push(...connectedVertices);
                }
            }
        }
    }
}
exports.Iterator = Iterator;
