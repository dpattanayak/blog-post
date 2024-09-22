import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "blue",
  textColor = "text-text-dark",
  className = "",
  disabled = false,
  ...rest
}) {
  const getBgClass = () => {
    const baseColor = disabled ? "800" : "600";
    return `bg-${bgColor}-${baseColor} ${disabled ? "bg-opacity-60" : ""}`;
  };

  const getHoverClass = () => {
    return !disabled ? `hover:bg-${bgColor}-700` : "";
  };

  return (
    <button
      className={`px-4 py-2 rounded-lg w-full ${getBgClass()} ${getHoverClass()} ${textColor} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
