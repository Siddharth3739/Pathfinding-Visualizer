
import {
  MinPriorityQueue,
} from
  "@datastructures-js/priority-queue";
 
  

export function dijkstra(grid, startNode, finishNode) {
  const pq=new MinPriorityQueue( (node)=>node.distance
  );
  const visitedNodesInOrder = [];
  startNode.distance = 0;
  pq.enqueue(startNode);
  while(!pq.isEmpty())
  {
    const closestNode = pq.dequeue();
    if(closestNode.isWall||closestNode.isVisited) continue;
    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);
    if (closestNode === finishNode) return visitedNodesInOrder;
    const unvisitedNeighbors = getUnvisitedNeighbors(closestNode, grid);
    for (const neighbor of unvisitedNeighbors) {
      if(neighbor.distance>closestNode.distance+closestNode.weight)
      {
       neighbor.distance = closestNode.distance+closestNode.weight;
       neighbor.previousNode = closestNode;
       pq.enqueue(neighbor);
      }
    }
  }
  return visitedNodesInOrder;
}
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const {col, row} = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}
export function getNodesInShortestPathOrder(finishNode) {

  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
