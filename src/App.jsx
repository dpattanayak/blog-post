import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { Container, Footer, Header, Loading } from "./components";
import { auth, database, storage } from "./services";
import { login, logout, profile } from "./store/authSlice";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const profileState = useSelector((state) => state.auth.profile);
  const dispatch = useDispatch();

  useEffect(() => {
    auth
      .getCurrentUser()
      .then((userData) => {
        if (userData) {
          database.getProfile(userData.$id).then((data) => {
            if (data?.profilePic && !profileState) {
              const file = storage.getFilePreview(data.profilePic);
              dispatch(profile({ ...data, href: file.href }));
            }
          });
          dispatch(login(userData));
        } else dispatch(logout());
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Container>
      <Header />
      <main className="min-h-[85vh]">
        {isLoading ? <Loading /> : <Outlet />}
      </main>
      <Footer />
    </Container>
  );
}

export default App;
