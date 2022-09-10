import React from "react";
import { Pulse
} from "better-react-spinkit";


const Loader = () => {
  return (
    <div styles = {{  
        position: "absolute",
        top: "50%",
        left: "0",
        alignItems: 'center',
        display: "grid",
        height: "100vh",
        placeItems: "center",
        color: "#0B0055"}}
    >
      <h3>Please wait ...</h3>
      <Pulse color="#0B0055" size={60} />
    </div>
  );
};

export default Loader;
