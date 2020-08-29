import React, { useState, useCallback, useRef } from "react";
import styled from "styled-components";
import produce from "immer";
import "./App.css";

const rowPlaces = 30;
const colValues = 30;
// [(UP/DWN), (L/R)]
// U = -1, D = 1, L = -1, R = 1
const neighborCoords = [
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 1],
  [1, 0],
  [-1, -1],
  [-1, 1],
  [-1, 0],
];

const Box = styled.div`
  display: grid;
  grid-template-columns: repeat(${colValues}, 20px);
`;

const emptyGrid = () => {
  // initialize outer array
  const rows = [];
  // for as many number of 'rowplaces'...(50)
  for (let i = 0; i < rowPlaces; i++) {
    // produce an array w/ length of 'colValues' populated by 0's... (50)
    rows.push(Array.from(Array(colValues), () => 0));
  }
  // rows --> array of 50 arrays, each containing 50 0's
  return rows;
};

const App = () => {
  // gridIs --> rows
  const [gridIs, setGrid] = useState(() => {
    return emptyGrid();
  });

  const randomGrid = () => {
    const rows = [];
    // for as many number of 'rowplaces'...(50)
    for (let i = 0; i < rowPlaces; i++) {
      // produce an array w/ length of 'colValues' populated by 0's... (50)
      rows.push(
        Array.from(Array(colValues), () => (Math.random() > 0.75 ? 1 : 0))
      );
    }
    setGrid(rows);
  };

  const [growing, setGrowing] = useState(false);

  const growingRef = useRef(growing);
  growingRef.current = growing;

  //trigger next stage of growth based on previous growing state
  // f() should be immune to re-rendering when growth state changes
  //useCallback ensures the f() only gets created once in time and does not re-render - it does not recreate itself with a new version of growing after its state is updated
  //but the state it wants to access will be changing
  //to provide the stale f() with access to the dynamic state we need to 'hold' the state somewhere outside of its hook with a useref
  const catalyze = useCallback(() => {
    //basecase
    //if not growing, exit f()
    if (!growingRef.current) {
      return;
    }
    //otherwise change cells iteratively according to neighbor conditions --> mutate copy of grid state --> update grid state immutably
    setGrid((grid) => {
      return produce(grid, (gridCopy) => {
        for (let i = 0; i < rowPlaces; i++) {
          for (let j = 0; j < colValues; j++) {
            let neighbors = 0;
            //dynamically map over neighborCoords for each cell to determine how many possible neighbors a given cell has
            neighborCoords.forEach(([x, y]) => {
              //apply the neighbor coordinates to navigate from the origin of a given cell to its neighbors
              const updatedI = i + x;
              const updatedJ = j + y;
              //check that the neighbor coordinates of a given cell fall within the range of the grid
              if (
                updatedI >= 0 &&
                updatedI < rowPlaces &&
                updatedJ >= 0 &&
                updatedJ < colValues
              ) {
                neighbors += grid[updatedI][updatedJ];
              }
            });
            //if a cell has fewer than 2 or more than 3 neighbors, it dies
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
              // if a cell is dead (0) and it has 3 neighbors
            } else if (grid[i][j] === 0 && neighbors === 3) {
              // it becomes alive
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    //every cell is the coordinate of a row and a col
    //each recursive call, the cells composing the grid change ( to alive or dead ) according to:
    //the number of neighbors they have
    //
    //at each second the recursive call follows the cell conditions to mutate our copy of the grid state and not the grid state itself so as to follow principles of immutability
    //the game of life rules will dictate the conditions of cells in each recursive call of f()

    //recursively call f() every 1 second to check if growing is true
    setTimeout(catalyze, 500);
  }, []);

  return (
    <div className="App-header">
      <button
        onClick={() => {
          setGrowing(!growing);
          if (!growing) {
            growingRef.current = true;
            catalyze();
          }
        }}
      >
        {growing ? "Terminate" : "Catalyze"}
      </button>

      <button
        onClick={() => {
          setGrid(emptyGrid());
        }}
      >
        clear
      </button>

      <button
        onClick={() => {
          randomGrid();
        }}
      >
        randomize
      </button>
      <Box>
        {/* a cell coordinate is determined by the axes of i and j */}
        {gridIs.map((rows, i) =>
          rows.map((col, j) => (
            <div
              onClick={() => {
                //                  current immutable state, updated immutable state
                const newGrid = produce(gridIs, (gridCopy) => {
                  //updated cell position boolean toggle
                  gridCopy[i][j] = gridIs[i][j] ? 0 : 1;
                });
                //setState to updated state containing updated cell positions
                setGrid(newGrid);
              }}
              key={`${i}-${j}`}
              style={{
                height: 18,
                width: 18,
                margin: "1px 1px auto",
                borderRadius: "100%",
                boxShadow: "inset 0 0 3px #484f5e",
                border: "solid 1px #484f5e",
                //color is green if cell position is toggled true otherwise its undefined (blank)
                backgroundColor: gridIs[i][j] ? "#95e6cb" : undefined,
              }}
            />
          ))
        )}
      </Box>
    </div>
  );
};

export default App;
