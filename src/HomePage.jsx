import React from "react";
import { Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import './App.css';

const HomePage = () => {
    const navigate = useNavigate(); 

    const handleBookDemo = () => {
        navigate('/user'); 
    };

    

    const handleLoginRedirect = () => {
      navigate("/login");  
    };

  return (
    <div className="home-page">
      <div className="header">
        Direct Booking Website
      </div>

    <main>
      <section>
        <h2>Welcome to Your Perfect Stay</h2>
        <p>
          Transform your online presence into a booking magnet with an exceptional
          user experience on your direct booking website.
        </p>
      </section>

      <Container>
        <div className="buttons-container">
          <Button variant="contained" color="primary" onClick={handleLoginRedirect} className="login-btn">
            Log In
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="demo-btn"
            onClick={handleBookDemo} 
          >
            Book A Demo
          </Button>
        </div>
      </Container>
    </main>


      {/* Footer */}
      <div className="footer">
        All rights reserved.
      </div>
    </div>
  );
};

export default HomePage;
