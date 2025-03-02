import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, TextField, Button, Grid, Typography, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, Slider, Box, Rating } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginButton from "./LoginButton";
import './App.css';

const UserPage = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]); 
  const [bookingHistory, setBookingHistory] = useState([
    { hotelName: 'Hotel 1', date: '2023-01-15', status: 'Completed' },
    { hotelName: 'Hotel 2', date: '2023-02-10', status: 'Cancelled' }
  ]);
  const [rating, setRating] = useState(0);
  const [userFeedback, setUserFeedback] = useState('');
  const userEmail = localStorage.getItem("userEmail");
  const [openFilterDialog, setOpenFilterDialog] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    price: [0, 500],
    rating: [0, 5],
    amenities: ''
  });

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/hotels');
        setHotels(response.data); 
      } catch (err) {
        console.error("Error fetching hotels: ", err);
      }
    };

    fetchHotels(); 
  }, []); 


 useEffect(() => {
  const fetchBookingHistory = async () => {
    const email = localStorage.getItem("userEmail"); 
    console.log("User Email from localStorage:", localStorage.getItem("userEmail"));
    if (email) {
      try {
        const response = await axios.get(`http://localhost:3000/api/reservations/${email}`);
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


  const handleOpenFilterDialog = () => {
    setOpenFilterDialog(true);
  };

  const handleFilterChange = (event) => {
  const { name, value } = event.target;
  setFilters({
    ...filters,
    [name]: value 
  });
};

  const handleApplyFilters = async () => {
  try {
    const location = filters.location ? filters.location.trim() : '';

    console.log("Sending Filters: ", filters); 

    const response = await axios.get('http://localhost:3000/api/hotels', {
      params: {
        location: location,  
        minPrice: filters.price[0],
        maxPrice: filters.price[1],
        minRating: filters.rating[0],
        maxRating: filters.rating[1],
        amenities: filters.amenities
      }
    });

    console.log("Filtered Hotels: ", response.data); 

    setHotels(response.data); 
    setOpenFilterDialog(false); 
  } catch (err) {
    console.error("Error applying filters:", err);
  }
};

  const handleFeedbackChange = (e) => {
    setUserFeedback(e.target.value); 
  };

  const handleRatingChange = (event, newValue) => {
    setRating(newValue); 
  };

  const handleReserveClick = () => {
    navigate('/reservation'); 
  };

  const handleFeedbackSubmit = async () => {
    if (!userEmail) {
      alert("You need to log in to submit feedback.");
      return;
    }

    if (rating < 1 || rating > 5 || !userFeedback.trim()) {
      alert("Please provide a rating and comment.");
      return;
    }

    const feedbackData = {
      email: userEmail,  
      rating,
      comment: userFeedback
    };

    try {
      const response = await axios.post("http://localhost:3000/api/feedback", feedbackData);
      alert("Your feedback has been submitted!");
      setUserFeedback('');
      setRating(0); 
    } catch (err) {
      console.error("Error submitting feedback:", err);
      alert("Something went wrong. Please try again!");
    }
  };


  return (
    <div className="user-page">
      <Container>
        <Typography variant="h3" className="title">
          Find Your Perfect Stay
        </Typography>

        {/* Search Bar */}
        <div className="hotel-search">
          {/* Search Button to open filter modal */}
        <Button style={{
          backgroundColor: '#9b59b6',
          color: 'white',
          padding: '8px 20px',
          borderRadius: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          width: '100%',
          size: '2rem'
        }}
        onClick={handleOpenFilterDialog}>
          Search and Filter
        </Button>

        </div>

        {/* Hotel List */}
        <Typography variant="h4" style={{ marginBottom: '20px' }}>
          Available Hotels
        </Typography>
        <Grid container spacing={3}>
          {hotels.map((hotel, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card className="hotel-card">
                <CardContent>
                  <Typography variant="h5">{hotel.name}</Typography>
                  <Typography variant="body1" style={{ marginBottom: '10px' }}>
                    {hotel.description}
                  </Typography>
                  <Typography variant="h6">Price: {hotel.price}</Typography>
                  <Typography variant="body2" style={{ marginBottom: '20px' }}>
                    Rating: {hotel.rating} ★
                 </Typography>
                  <Button variant="contained" color="primary" onClick={handleReserveClick} >
                    Reserve Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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

        {/* User Feedback Section */}
        <div className="feedback">
          <Typography variant="h4" style={{ marginBottom: '20px' }}>
            Leave Your Feedback
          </Typography>
          {/* Star Rating System */}
      <Rating
        name="feedback-rating"
        value={rating}
        onChange={handleRatingChange}
        size="large"
        precision={0.5}  
      />

      {/* Feedback Comment */}
      <TextField
        label="Write your feedback"
        variant="outlined"
        fullWidth
        multiline
        rows={4}
        value={userFeedback}
        onChange={handleFeedbackChange}
        style={{ marginTop: '20px' }}
      />

      {/* Submit Feedback Button */}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleFeedbackSubmit}
        style={{ marginTop: '20px' }}
      >
        Submit Feedback
      </Button>
        </div>

        {/* Edit Profile Button */}
        <div className="buttons-container">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/edit-profile')}
            style={{ 
              color: "primary",
              padding: '8px 20px',
              borderRadius: '30px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              width: '100%',
              size: '2rem'}}
          >
            Edit Profile
          </Button>
        </div>

        <div>
          <LoginButton /> 
        </div>
        {/* Filter Dialog */}
        <Dialog open={openFilterDialog} onClose={() => setOpenFilterDialog(false)} fullWidth>
          <DialogTitle>Filter Hotels</DialogTitle>
          <DialogContent>
            <Typography>Location:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              name="location"
              value={filters.location || ''}
              onChange={handleFilterChange}
            />

            <Typography>Price Range:</Typography>
            <Slider
              name="price"
              value={filters.price}
              onChange={handleFilterChange}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              valueLabelFormat={(value) => `$${value}`}
              valuelabel="auto"
            />

            <Typography>Rating Range:</Typography>
            <Slider
              name="rating"
              value={filters.rating}
              onChange={handleFilterChange}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={0.1}
              valueLabelFormat={(value) => `${value} ★`}
              valuelabel="auto"
            />

            <Typography>Amenities:</Typography>
            <TextField
              fullWidth
              variant="outlined"
              name="amenities"
              value={filters.amenities}
              onChange={handleFilterChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenFilterDialog(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleApplyFilters} color="primary">
              Apply Filters
            </Button>
          </DialogActions>
        </Dialog>

      </Container>
    </div>
  );
};

export default UserPage;
