import React from "react";
import { Circle } from "better-react-spinkit";


const Loader = () => {
  return (
    <div styles = {{  
        display: "grid",
        height: "30vh",
        placeItems: "center",
        color: "#d2d2d2"}}
    >
      <h3>Please wait while we configure editor settings</h3>
      <Circle color="#d2d2d2" size={60} />
    </div>
  );
};

export default Loader;
