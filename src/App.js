import React, { useState } from "react";
import "./App.css";

const rowPlaces = 50;
const colValues = 50;

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

  console.log(gridIs);
  return <div className="App"></div>;
};

export default App;
