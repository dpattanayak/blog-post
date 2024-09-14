import React from "react";

function Container({ children, className = "" }) {
  return (
    <div
      className={`flex flex-wrap text-text-light dark:text-text-dark bg-secondary-light dark:bg-secondary-dark ${className}`}
    >
      <div className="w-full block">{children}</div>
    </div>
  );
}

export default Container;
