import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container } from "../components";

function FallBackPage({
  title = "Unauthorized Access",
  subtitle = "You do not have permission to view this page, please login.",
  redirect = "login",
}) {
  const authStatus = useSelector((state) => state.auth.status);
  useEffect(() => {
    if (!authStatus)
      window.scrollTo({
        top: document.body.scrollHeight / 2 - window.innerHeight / 2,
        behavior: "smooth",
      });
  }, []);

  const capitalize = (str) => {
    const replacedStr = str.replace(/-/g, " ");
    return replacedStr
      .split(" ") // Split the string into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(" ");
  };
  return (
    <Container className="items-center content-center bg-zinc-200 rounded-lg min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-4">{subtitle}</p>
        <Link
          to={`/${redirect}`}
          className="font-medium text-primary transition-all duration-200 hover:underline"
        >
          Redirect to : {capitalize(redirect)}
        </Link>
      </div>
    </Container>
  );
}

export default FallBackPage;
