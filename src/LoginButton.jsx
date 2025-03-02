import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const LoginButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={() => navigate("/login")}
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        zIndex: 1000,
      }}
    >
      Login
    </Button>
  );
};

export default LoginButton;
