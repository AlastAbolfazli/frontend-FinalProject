import React, { useState, useEffect } from 'react';
import { Button, TextField, Container, Typography, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import axios from "axios";
import "./App.css";

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const EditProfile = () => {
  const navigate = useNavigate();

  const [bookingHistory, setBookingHistory] = useState([
    { hotelName: 'Hotel 1', date: '2023-01-15', status: 'Completed' },
    { hotelName: 'Hotel 2', date: '2023-02-10', status: 'Cancelled' }
  ]);

  const storedUserId = localStorage.getItem("userId");
  const storedEmail = localStorage.getItem("userEmail");

  const [userData, setUserData] = useState({
    email: storedEmail || "",
    newPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/users/update`, {
        userId: storedUserId,
        newEmail: userData.email === storedEmail ? null : userData.email,
        newPassword: userData.newPassword || null,
      });

      alert("Profile updated successfully!");

      if (userData.email !== storedEmail) {
        localStorage.setItem("userEmail", userData.email);
      }

      navigate("/user");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert(error.response?.data?.error || "Failed to update profile");
    }
  };

   useEffect(() => {
  const fetchBookingHistory = async () => {
    const email = localStorage.getItem("userEmail"); 
    console.log("User Email from localStorage:", localStorage.getItem("userEmail"));
    if (email) {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/reservations/${email}`);
        console.log("Fetched booking history:", response.data);
        setBookingHistory(response.data); 
      } catch (err) {
        console.error("Error fetching booking history:", err);
      }
    }else{
      navigate("/login")
    }
  };

  fetchBookingHistory(); 
}, []);


  return (
    <div className="edit-profile">
      <Container>
        <Typography variant="h4" style={{ marginBottom: "30px" }}>
          Edit Your Profile
        </Typography>

        <Grid container spacing={2} style={{ marginBottom: "20px" }}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={userData.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="New Password (Optional)"
              variant="outlined"
              fullWidth
              name="newPassword"
              type="password"
              value={userData.newPassword}
              onChange={handleInputChange}
            />
          </Grid>
        </Grid>

        <div className="buttons-container">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveProfile}
            style={{ padding: "10px 20px" }}
          >
            Save Changes
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/user")}
            style={{ padding: "10px 20px", marginLeft: "20px" }}
          >
            Cancel
          </Button>
        </div>

        <div>
          <LoginButton /> 
        </div>
        {/* Booking History */}
                <div className="booking-history">
                  <Typography variant="h4" style={{ marginBottom: '20px' }}>
                    Your Booking History
                  </Typography>
                  {bookingHistory.length > 0 ? (
                    bookingHistory.map((booking, index) => (
                      <div className="hotel-item" key={index}>
                        <Typography variant="h6">{booking.hotel_name}</Typography>
                        <Typography variant="body1">
                          Check-in: {new Date(booking.check_in_date).toLocaleDateString()} - 
                          Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
                        </Typography>
                        <Typography>Status: {booking.status}</Typography>
                      </div>
                    ))
                  ) : (
                    <Typography>No past bookings found.</Typography>
                  )}
                </div>
      </Container>
    </div>
  );
};

export default EditProfile;
