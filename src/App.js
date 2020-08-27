import React, { useState } from "react";
import styled from "styled-components";
import produce from "immer";
// import "./App.css";

const rowPlaces = 50;
const colValues = 50;

const Box = styled.div`
  display: grid;
  grid-template-columns: repeat(${colValues}, 20px);
`;

const App = () => {
  // gridIs --> rows
  const [gridIs, setGrid] = useState(() => {
    // initialize outer array
    const rows = [];
    // for as many number of 'rowplaces'...(50)
    for (let i = 0; i < rowPlaces; i++) {
      // produce an array w/ length of 'colValues' populated by 0's... (50)
      rows.push(Array.from(Array(colValues), () => 0));
    }
    // rows --> array of 50 arrays, each containing 50 0's
    return rows;
  });

  return (
    <Box>
      {gridIs.map((rows, i) =>
        rows.map((col, j) => (
          <div
            onClick={() => {
              // current state, updated state
              const newGrid = produce(gridIs, (gridCopy) => {
                //immutable change to true bool
                gridCopy[i][j] = gridIs[i][j] ? 0 : 1;
              });
              setGrid(newGrid);
            }}
            key={`${i}-${j}`}
            style={{
              height: 18,
              width: 18,
              margin: "1px 1px auto",
              borderRadius: "100%",
              backgroundColor: gridIs[i][j] ? "#9DE0AD" : undefined,
            }}
          />
        ))
      )}
    </Box>
  );
};

export default App;
