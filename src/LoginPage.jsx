import React, { useState } from "react";
import { Button, TextField, Container, Typography, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isSignUp: false, 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, isSignUp } = formData;

    try {
      if (isSignUp) {
        const response = await axios.post("http://localhost:3000/api/signup", { email, password });
        alert("Sign up successful!");
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("userEmail", response.data.email);
        navigate("/user"); 
      } else {
        const response = await axios.post("http://localhost:3000/api/login", { email, password });

        if (response.data.isAdmin) {
          localStorage.setItem("userEmail", response.data.email);
          localStorage.setItem("token", response.data.token);  
          navigate("/admin"); 
        } else {
          localStorage.setItem("userId", response.data.userId);
          localStorage.setItem("userEmail", response.data.email);
          localStorage.setItem("token", response.data.token);  
          navigate("/user"); 
        }
      }
    } catch (error) {
      console.error("Login/Signup failed:", error);
      alert("Error! Please check your credentials or try again.");
    }
};

  const handleToggleForm = () => {
    setFormData({
      ...formData,
      isSignUp: !formData.isSignUp, 
    });
  };

  return (
    <div className="login-page">
      <Container>
        <Typography variant="h4" className="header-loginpage">
          {formData.isSignUp ? "Sign Up" : "Login"}
        </Typography>

        <form onSubmit={handleSubmit} className="login-page-form">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>

          <Box mt={3} textAlign="center">
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              style={{ marginBottom: "10px" }}
              className="login-button"
            >
              {formData.isSignUp ? "Sign Up" : "Login"}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleToggleForm}
              size="large"
              style={{ marginTop: "10px" }}
            >
              {formData.isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
            </Button>
          </Box>
        </form>
      </Container>
      {/* Footer */}
      <div className="footer-loginpage">
        All rights reserved.
      </div>
    </div>
  );
};

export default LoginPage;
