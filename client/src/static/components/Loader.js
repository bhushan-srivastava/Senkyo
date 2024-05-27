import React from "react";
import { Box } from "@mui/material";

const Loader = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        position: "absolute",
        minWidth: "100vw",
        top: "0",
        left: "0",
        minHeight: "100vh",
        // backgroundColor: "black",
        backdropFilter: 'blur(20px)',
        zIndex: "1000",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflowY: "hidden",
        overflowX: "hidden"

      }}
    >
      <svg
        version="1.1"
        id="L5"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        viewBox="0 0 100 100"
        // enableBackground="new 0 0 0 0"
        xmlSpace="preserve"
        style={{
          width: "100px",
          height: "100px",
          margin: "20px",
          display: "inline-block",
        }}
      >
        <circle fill="#2196f3" stroke="none" cx="6" cy="50" r="6">
          <animateTransform
            attributeName="transform"
            dur="1s"
            type="translate"
            values="0 15 ; 0 -15; 0 15"
            repeatCount="indefinite"
            begin="0.1"
          />
        </circle>
        <circle fill="#2196f3" stroke="none" cx="30" cy="50" r="6">
          <animateTransform
            attributeName="transform"
            dur="1s"
            type="translate"
            values="0 10 ; 0 -10; 0 10"
            repeatCount="indefinite"
            begin="0.2"
          />
        </circle>
        <circle fill="#2196f3" stroke="none" cx="54" cy="50" r="6">
          <animateTransform
            attributeName="transform"
            dur="1s"
            type="translate"
            values="0 5 ; 0 -5; 0 5"
            repeatCount="indefinite"
            begin="0.3"
          />
        </circle>
      </svg>
      {/* <Typography>Check the image and details entered...</Typography> */}
    </Box>
  );
};

export default Loader;
