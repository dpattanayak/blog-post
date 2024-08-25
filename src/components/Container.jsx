import React from "react";

function Container({ children }) {
  return (
    <div className="min-h-screen flex flex-wrap content-between bg-zinc-200">
      <div className="w-full block">{children}</div>
    </div>
  );
}

export default Container;
