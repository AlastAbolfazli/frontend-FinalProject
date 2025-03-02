import React, { useState } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';
import LoginButton from "./LoginButton";
import { TextField, Button, Container, Typography, Grid, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import './ReservationPage.css';



const ReservationPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    numberOfAdults: 1,
    numberOfChildren: 0,
    checkInDate: '',
    checkOutDate: '',
    roomPreference: 'Standard', 
    specialRequests: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const reservationData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    numberOfAdults: formData.numberOfAdults,
    numberOfChildren: formData.numberOfChildren,
    checkInDate: formData.checkInDate,
    checkOutDate: formData.checkOutDate,
    roomPreference: formData.roomPreference,
    specialRequests: formData.specialRequests
  };

  try {
    const response = await axios.post('http://localhost:3000/api/reservations', reservationData);
    if (response.status === 201) {
          alert('Reservation Successful!');
          navigate("/user"); 
        }
      } catch (err) {
        console.error('Error during reservation:', err);
        alert('Something went wrong, please try again!');
      }
};


  return (
    <div className="reservation-page">
      <Container className="form-container">
        <Typography variant="h2" className="page-title">
          Complete Your Reservation
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                variant="outlined"
                fullWidth
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                variant="outlined"
                fullWidth
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6} >
              <TextField
                label="Phone Number"
                variant="outlined"
                fullWidth
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Grid>

            {/* Adults selector */}
            <div>
              <label>Adults *</label>
              <select
                name="numberOfAdults"
                value={formData.numberOfAdults}
                onChange={handleChange}
              >
                {[...Array(10).keys()].map(i => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>

            {/* Children selector */}
            <div>
              <label>Children *</label>
              <select
                name="numberOfChildren"
                value={formData.numberOfChildren}
                onChange={handleChange}
              >
                {[...Array(10).keys()].map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>


            {/* Room Preference Section */}
            <Grid item xs={12}>
              <FormControl component="fieldset" required>
                <FormLabel component="legend">Room Preference</FormLabel>
                <RadioGroup
                  name="roomPreference"
                  value={formData.roomPreference}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel value="Standard" control={<Radio />} label="Standard" />
                  <FormControlLabel value="Deluxe" control={<Radio />} label="Deluxe" />
                  <FormControlLabel value="Suite" control={<Radio />} label="Suite" />
                  <FormControlLabel value="Superior" control={<Radio />} label="Superior" />
                  <FormControlLabel value="Beachfront" control={<Radio />} label="Beachfront" />
                  <FormControlLabel value="Garden View" control={<Radio />} label="Garden View" />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Check-in Date"
                type="date"
                variant="outlined"
                fullWidth
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Check-out Date"
                type="date"
                variant="outlined"
                fullWidth
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleChange}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Special Requests (optional)"
                variant="outlined"
                fullWidth
                name="specialRequests"
                value={formData.specialRequests}
                onChange={handleChange}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Box textAlign="center" mt={4}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
              className="reserve-button"
            >
              Confirm Reservation
            </Button>

            {/* Cancel Button */}
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => window.history.back()}
              size="large"
              style={{ marginLeft: '10px' }}
              className='cancel-button'
            >
              Cancel
            </Button>
          </Box>
        </form>

        <div>
          <LoginButton /> 
        </div>
        
      </Container>
    </div>
  );
};

export default ReservationPage;
