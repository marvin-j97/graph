import { Vertex } from "./vertex";
import { HashMap } from "./util";

function reconstructPath(cameFrom: HashMap<Vertex>, current: Vertex): Vertex[] {
  let totalPath = [current];

  while (Object.keys(cameFrom).includes(current.getKey())) {
    current = cameFrom[current.getKey()];
    totalPath.unshift(current);
  }

  return totalPath;
}

export class Iterator {
  static AStar(start: Vertex, end: string): Vertex[] | null {
    let openSet = [start] as Vertex[];
    const cameFrom = {} as HashMap<Vertex>;

    let gScore = {} as HashMap<number>;
    gScore[start.getKey()] = 0;

    let fScore = {} as HashMap<number>;
    fScore[start.getKey()] = 0;

    const closedSet = [] as Vertex[];

    let current = null as Vertex | null;

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
          // This path to neighbor is better than any previous one. Record it!
          cameFrom[neighbor.getKey()] = current;
          gScore[neighbor.getKey()] = tentative;
          fScore[neighbor.getKey()] = gScore[neighbor.getKey()];

          if (!openSet.includes(neighbor))
            openSet.push(neighbor)
        }
      }
    }

    return null;
  }

  static breadthFirstTraversal(start: Vertex, onVisit?: (v: Vertex) => boolean | void, undirected?: boolean): void {
    const queue: Vertex[] = [start];
    const visited: HashMap<boolean> = {};

    const hasBeenVisited = (key: string) => visited[key] === true;

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

  static depthFirstTraversal(start: Vertex, onVisit?: (v: Vertex) => boolean | void, undirected?: boolean): void {
    const stack: Vertex[] = [start];
    const visited: HashMap<boolean> = {};

    const hasBeenVisited = (key: string) => visited[key] === true;

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