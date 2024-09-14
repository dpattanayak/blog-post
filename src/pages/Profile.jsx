import React from "react";
import { useSelector } from "react-redux";
import { Container, Profile as ProfileComponent } from "../components";

function Profile() {
  const userData = useSelector((state) => state.auth.userData);

  return (
    <Container>
      <ProfileComponent profileData={userData} />
    </Container>
  );
}

export default Profile;
