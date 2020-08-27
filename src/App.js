import React, { useState, useCallback, useRef } from "react";
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

  const [growing, setGrowing] = useState(false);

  const growingRef = useRef(growing);
  growingRef.current = growing;

  //trigger function should be immune to re-rendering
  //trigger function only gets created once in time and does not re-render - it does not recreate itself with a new version of growing after its state is updated
  //but the state it wants to access will be changing
  //to provide the persisting function with access to the changing state we need to 'hold' the state somewhere outside of its hook with a useref
  const catalyze = useCallback(() => {
    //if not growing, return outside of the scope of immunity that useCallback provides to preserve against re-rendering
    //basecase
    if (!growingRef) {
      return;
    }

    //trigger growth
    setTimeout(catalyze, 1000);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setGrowing(!growing);
        }}
      >
        Start Growth
      </button>
      <Box>
        {/* a cell coordinate is determined by the axes of i and j */}
        {gridIs.map((rows, i) =>
          rows.map((col, j) => (
            <div
              onClick={() => {
                //                  current state, updated state
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
                borderRadius: "80% 0% 80%",
                border: "solid 1px #a6cc7099",
                //color is green if cell position is toggled true otherwise its undefined (blank)
                backgroundColor: gridIs[i][j] ? "#9DE0AD" : undefined,
              }}
            />
          ))
        )}
      </Box>
    </>
  );
};

export default App;
