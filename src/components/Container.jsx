import React from "react";

function Container({ children, className }) {
  return (
    <div className={`min-h-screen flex flex-wrap ${className}`}>
      <div className="w-full block">{children}</div>
    </div>
  );
}

export default Container;
