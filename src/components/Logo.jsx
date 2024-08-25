import React from "react";

function Logo({ width = "50", height = "50" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4"
        y="2"
        width="16"
        height="20"
        rx="2"
        fill="#f0f0f0"
        stroke="#333"
        strokeWidth="1.5"
      />
      <line
        x1="4"
        y1="6"
        x2="20"
        y2="6"
        stroke="#333"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="10"
        x2="20"
        y2="10"
        stroke="#333"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="14"
        x2="20"
        y2="14"
        stroke="#333"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M9 15L16.5 7.5C17.1 6.8 18 6.4 19 6.5C19.2 6.5 19.4 6.6 19.6 6.7C19.8 6.8 20 7 20.1 7.2C20.2 7.4 20.3 7.6 20.4 7.8C20.5 8 20.5 8.2 20.4 8.4C20.3 8.6 20.1 8.8 19.9 9L12 15L9 18L8 16.5L9 15Z"
        fill="#333"
      />
    </svg>
  );
}

export default Logo;
