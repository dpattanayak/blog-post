import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header, Loading } from "./components";
import { auth } from "./services";
import { login, logout } from "./store/authSlice";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    auth
      .getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else dispatch(logout());
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Container>
      <Header />
      <main className="p-10">{isLoading ? <Loading /> : <Outlet />}</main>
      <Footer />
    </Container>
  );
}

export default App;
