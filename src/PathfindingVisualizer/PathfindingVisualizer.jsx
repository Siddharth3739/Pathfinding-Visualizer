import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

let START_NODE_ROW = 10;
let START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;
let stop=false;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      changingStart: false,
      type: "",
      WallButtonText: "Insert Wall",
      ModifyWeightText: "Modify Node Weights",
    };
  }
  
  removeStartNode()
  {
    if(START_NODE_ROW==-1||START_NODE_COL==-1)
    return;
    const newGrid=this.state.grid.slice();
    const node=newGrid[START_NODE_ROW][START_NODE_COL];
    node.isStart=false;
    START_NODE_ROW=-1;
    START_NODE_COL=-1;
    this.setState({grid:newGrid,changingStart:true});
    this.clear();
  }
  insertNewStart(row,col)
  {
    START_NODE_ROW=row;
    START_NODE_COL=col;
    let newGrid=this.state.grid.slice();
    let node=createNode(col,row);
    node.isStart=true;
    newGrid[row][col]=node;
    this.setState({grid:newGrid,changingStart:false});
    return;
  }
  clear()
  {
    stop=true;
    const {grid}=this.state;
    const newGrid = [];
    for (let row = 0; row < 20; row++) {
      const currentRow = [];
      for (let col = 0; col < 50; col++) {
        if(!(grid[row][col].isStart||grid[row][col].isFinish)&&grid[row][col].isVisited)
        document.getElementById(`node-${row}-${col}`).className='node';
        if(!(grid[row][col].isStart||grid[row][col].isFinish)&&grid[row][col].isWall)
        document.getElementById(`node-${row}-${col}`).className='node';
        currentRow.push(createNode(col, row));
      }
      newGrid.push(currentRow);
    }
    this.setState({grid:newGrid,type:"", WallButtonText: "Insert Wall",ModifyWeightText: "Modify Node Weights"});
    var id = window.setTimeout(function() {}, 0);
    while (id--) {
        window.clearTimeout(id);
    }
    stop=false;
  }
  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if(this.state.changingStart)
    {
       this.insertNewStart(row,col);
       return;
    }
    if(this.state.type=="")
    return;
    if(this.state.type=="Wall")
    {
     const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
     this.setState({grid: newGrid, mouseIsPressed: true});
     return;
    }
    if(this.state.type=="Modify")
    {
     const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
     this.setState({grid: newGrid, mouseIsPressed: true});
     return;
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if(this.state.type=="")
    return;
    if(this.state.type=="Wall")
    {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({grid: newGrid});
      return;
    }
    if(this.state.type=="Modify")
    {
      const newGrid = getNewGridWithWeightToggled(this.state.grid, row, col);
      this.setState({grid: newGrid, mouseIsPressed: true});
      return;
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 1; i < visitedNodesInOrder.length; i++) {
      if(stop)
      return;
      if (i === visitedNodesInOrder.length-1) {
        setTimeout(() => {
          if(stop)
          return;
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        if(stop)
        return;
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 1; i < nodesInShortestPathOrder.length-1; i++) {
      if(stop)
      return;
      setTimeout(() => {
        if(stop)
        return;
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }
  insertWall()
  {
    if(this.state.type=="")
    {
      this.setState({type:"Wall",WallButtonText:"Inserting Walls"});
    }
    else if(this.state.type=="Wall")
    {
      this.setState({type:"",WallButtonText:"Insert Wall"});
    }
  }
  ModifyWeight()
  {
    if(this.state.type=="")
    {
      this.setState({type:"Modify",ModifyWeightText:"Modifying Node weights"});
    }
    else if(this.state.type=="Modify")
    {
      this.setState({type:"",ModifyWeightText:"Modify Node weights"});
    }
  }
  render() {
    const {grid, mouseIsPressed,WallButtonText,ModifyWeightText} = this.state;

    return (
      <>
        <button onClick={() => this.clear()}>
          Clear
        </button>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        <button onClick={() => this.removeStartNode()}>
          Change start node
        </button>
        <button onClick={() => this.insertWall()}>
          {WallButtonText}
        </button>
        <button onClick={() => this.ModifyWeight()}>
          {ModifyWeightText}
        </button>
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall,isWeighted} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      isWeighted={isWeighted}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    weight: 1,
    isWeighted: false,
    isWall: false,
    previousNode: null,
  };
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithWeightToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    weight: node.isWeighted?1:2,
    isWeighted: !node.isWeighted,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

