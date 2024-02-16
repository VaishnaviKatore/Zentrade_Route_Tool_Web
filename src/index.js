// index.js
import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddAddress = () => {
    console.log("Adding address:", searchTerm);
  };

  return (
    <div  className="no-decoration">
      <h1 id="route">
        {" "}
        <u style={{color:"white "}}>
          Route <span style={{ color: "rgb(118, 10, 10)"} }>Planning Tool</span>{" "}
        </u>
      </h1>
      {}
      <App />
    </div>
  );
};

ReactDOM.render(<Index />, document.getElementById("root"));
