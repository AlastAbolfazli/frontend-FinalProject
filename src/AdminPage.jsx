import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import LoginButton from "./LoginButton";
import { Button, Container, Typography, Grid, Box, Card, CardContent, Radio , FormControl, TextField, FormLabel, RadioGroup, FormControlLabel } from '@mui/material';
import './AdminPage.css';

const API_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const AdminPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
        navigate("/login"); 
        }
    }, [navigate]);
    const [reservations, setReservations] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [selectedHotelId, setSelectedHotelId] = useState(''); 
    const { hotelId } = useParams();
    const [rooms, setRooms] = useState([]);  
    const [editRoom, setEditRoom] = useState({ id: '', roomType: '', price: '', capacity: '', available: true });  
    const [newRoom, setNewRoom] = useState({ roomType: '', price: '', capacity: '', available: true });  
    const [newHotel, setNewHotel] = useState({ name: '', location: '', description: '', price: '', rating: '' });
    const [feedbacks, setFeedbacks] = useState([]);
    const [editFeedback, setEditFeedback] = useState({ id: '', comment: '', rating: 0 });
    const token = localStorage.getItem('token');  

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/hotels`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                console.log("Fetched hotels:", response.data);  
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
            }
        };
        fetchHotels();
    }, [token]);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/reservations`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReservations(response.data);
            } catch (error) {
                console.error("Error fetching reservations:", error);
            }
        };

        fetchReservations();
    }, [token]);


    const handleStatusChange = async (reservationId, newStatus) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/reservations/status`, {
                reservationId,
                newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Reservation status updated successfully!");

            setReservations(reservations.map(res =>
                res.id === reservationId ? { ...res, status: newStatus } : res
            ));
        } catch (error) {
            console.error("Error updating reservation status:", error);
            alert("Failed to update status. Please try again.");
        }
    };



    // Fetch rooms when a hotel is selected
    useEffect(() => {
        if (selectedHotelId && !isNaN(selectedHotelId)) {
            const fetchRooms = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/rooms/${selectedHotelId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRooms(response.data);
                } catch (error) {
                    console.error('Error fetching rooms:', error);
                }
            };
            fetchRooms();
        } 
    }, [selectedHotelId, token]); 


    const handleHotelChange = (event) => {
        const hotelId = event.target.value;
        setSelectedHotelId(Number(hotelId));  
    };

    // Fetch rooms for the selected hotel
    useEffect(() => {
        if (hotelId) {
            const fetchRooms = async () => {
                try {
                    const response = await axios.get(`${API_BASE_URL}/api/rooms/${hotelId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setRooms(response.data);
                } catch (error) {
                    console.error('Error fetching rooms:', error);
                }
            };

            fetchRooms();
        }
    }, [hotelId, token]);

    // Handle the change in the new room form
    const handleNewRoomChange = (e) => {
        const { name, value } = e.target;
        setNewRoom({ ...newRoom, [name]: value });
    };

    // Handle the change in the edit room form
    const handleEditRoomChange = (e) => {
        const { name, value } = e.target;
        setEditRoom({ ...editRoom, [name]: value });
    };

    // Add a new room
    const handleAddRoom = async () => {
        if (!selectedHotelId || isNaN(selectedHotelId)) {  // Check if the ID is valid
            console.error("Error: No hotel selected or invalid hotel ID.");
            alert("Please select a hotel before adding a room.");
            return; 
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/rooms/${selectedHotelId}`, newRoom, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms([...rooms, response.data]);  
            setNewRoom({ roomType: '', price: '', capacity: '', available: true });  
        } catch (error) {
            console.error('Error adding room:', error);
        }
    };

    // Edit a room
    const handleEditRoom = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/rooms/${editRoom.id}`, editRoom, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(rooms.map((room) => (room.id === editRoom.id ? response.data : room))); 
            setEditRoom({ id: '', roomType: '', price: '', capacity: '', available: true });  
        } catch (error) {
            console.error('Error editing room:', error);
        }
    };

    // Delete a room
    const handleDeleteRoom = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/rooms/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRooms(rooms.filter((room) => room.id !== id));  
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };


    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/feedbacks`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setFeedbacks(response.data);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
            }
        };

        fetchFeedbacks();
    }, [token]);

     // Edit feedback
    const handleEdit = (id, comment, rating) => {
        setEditFeedback({ id, comment, rating });
    };

    const handleSaveEdit = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/api/feedbacks/${editFeedback.id}`, {
                comment: editFeedback.comment,
                rating: editFeedback.rating
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(feedbacks.map(feedback => feedback.id === editFeedback.id ? response.data : feedback));
            setEditFeedback({ id: '', comment: '', rating: 0 });
        } catch (error) {
            console.error("Error saving feedback:", error);
        }
    };

    // Delete feedback
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/feedbacks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
        } catch (error) {
            console.error("Error deleting feedback:", error);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewHotel({
            ...newHotel,
            [name]: value
        });
    };

    const handleAddHotel = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/hotels`, newHotel, {
            headers: { Authorization: `Bearer ${token}` }
        });
        const updatedHotelsResponse = await axios.get(`${API_BASE_URL}/api/hotels`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setHotels(updatedHotelsResponse.data);
        setNewHotel({ name: '', location: '', description: '', price: '', rating: '' });
    } catch (error) {
        console.error('Error adding hotel:', error);
    }
};


    const handleDeleteHotel = async (hotelName) => {
        if (!hotelName) {
            alert("Invalid hotel name");
            return;
        }

        try {
            const token = localStorage.getItem("token"); 
            const encodedHotelName = encodeURIComponent(hotelName); 

            const response = await axios.delete(`${API_BASE_URL}/api/hotels/${encodedHotelName}`, {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            });

            alert("Hotel deleted successfully!");
            setHotels((prevHotels) => prevHotels.filter((hotel) => hotel.name !== hotelName));

        } catch (error) {
            console.error("Error deleting hotel:", error);
            alert("Failed to delete hotel. Please try again.");
        }
    };

    return (
        <Container>
            <Typography variant="h3" className="admin-page-title" gutterBottom>
                Admin Dashboard
            </Typography>

            <Typography variant="h5" gutterBottom>
                Add New Hotel
            </Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Hotel Name"
                        fullWidth
                        name="name"
                        value={newHotel.name}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Location"
                        fullWidth
                        name="location"
                        value={newHotel.location}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        fullWidth
                        name="description"
                        value={newHotel.description}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Price"
                        fullWidth
                        name="price"
                        value={newHotel.price}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Rating"
                        fullWidth
                        name="rating"
                        value={newHotel.rating}
                        onChange={handleChange}
                    />
                </Grid>
            </Grid>

            <Box mt={3}>
                <Button variant="contained" color="primary" onClick={handleAddHotel}>
                    Add Hotel
                </Button>
            </Box>

            <Typography variant="h5" gutterBottom mt={5}>
                Manage Hotels
            </Typography>

            <Grid container spacing={3}>
                {hotels.map((hotel) => (
                    <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{hotel.name}</Typography>
                                <Typography variant="body1">{hotel.location}</Typography>
                                <Typography variant="body2" color="textSecondary">{hotel.description}</Typography>
                                <Typography variant="body1">Price: ${hotel.price}</Typography>
                                <Typography variant="body1">Rating: {hotel.rating}</Typography>
                                <Box mt={2}>
                                    <Button variant="contained" color="secondary" onClick={() => handleDeleteHotel(hotel.name)}>
                                        Delete Hotel
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Typography variant="h5" gutterBottom>Select a Hotel</Typography>
            <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Hotels</FormLabel>
            <RadioGroup value={selectedHotelId} onChange={handleHotelChange}>
                {hotels.map((hotel) => {
                    return (
                        <FormControlLabel
                            key={hotel.id}
                            value={hotel.id}
                            control={<Radio />}
                            label={hotel.name}
                        />
                    );
                })}
            </RadioGroup>
            </FormControl>

        {/* Once a hotel is selected, display rooms for that hotel */}
        {selectedHotelId && (
            <>
                <Typography variant="h5" gutterBottom>Manage Rooms for Hotel {selectedHotelId}</Typography>
                {/* Fetch and display rooms based on selectedHotelId */}
            </>
        )}

            {selectedHotelId && (
                <>
                    <Grid container spacing={3}>
                        {rooms.map((room) => (
                            <Grid item xs={12} sm={6} md={4} key={room.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">{room.room_type}</Typography>
                                        <Typography variant="body1">Price: ${room.price}</Typography>
                                        <Typography variant="body1">Capacity: {room.capacity}</Typography>
                                        <Typography variant="body1">Available: {room.available ? 'Yes' : 'No'}</Typography>
                                        <Box mt={2}>
                                            <Button variant="contained" color="primary" onClick={() => setEditRoom({ id: room.id, roomType: room.room_type, price: room.price, capacity: room.capacity, available: room.available })}>
                                                Edit
                                            </Button>
                                            <Button variant="contained" color="secondary" onClick={() => handleDeleteRoom(room.id)}>
                                                Delete
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}

            {/* Edit Room Form */}
            {editRoom.id && (
                <Box component="form" display="flex" flexDirection="column" alignItems="flex-start" mt={5}>
                    <Typography variant="h6" gutterBottom>Edit Room</Typography>
                    <TextField label="Room Type" name="roomType" value={editRoom.roomType} onChange={handleEditRoomChange} fullWidth />
                    <TextField label="Price" name="price" value={editRoom.price} onChange={handleEditRoomChange} fullWidth type="number" />
                    <TextField label="Capacity" name="capacity" value={editRoom.capacity} onChange={handleEditRoomChange} fullWidth type="number" />
                    <label>
                        Available:
                        <input type="checkbox" name="available" checked={editRoom.available} onChange={(e) => setEditRoom({ ...editRoom, available: e.target.checked })} />
                    </label>
                    <Button variant="contained" color="primary" onClick={handleEditRoom}>Save Changes</Button>
                </Box>
            )}

            {/* Room Management Section */}
            <Typography variant="h5" gutterBottom>Manage Rooms for Hotel {hotelId}</Typography>

            {/* New Room Form */}
            <Box component="form" display="flex" flexDirection="column" alignItems="flex-start">
                <TextField label="Room Type" name="roomType" value={newRoom.roomType} onChange={handleNewRoomChange} fullWidth />
                <TextField label="Price" name="price" value={newRoom.price} onChange={handleNewRoomChange} fullWidth type="number" />
                <TextField label="Capacity" name="capacity" value={newRoom.capacity} onChange={handleNewRoomChange} fullWidth type="number" />
                <label>
                    Available:
                    <input type="checkbox" name="available" checked={newRoom.available} onChange={(e) => setNewRoom({ ...newRoom, available: e.target.checked })} />
                </label>
                <Button variant="contained" color="primary" onClick={handleAddRoom}>Add Room</Button>
            </Box>

            <Typography variant="h3" gutterBottom>Manage User Feedback</Typography>

            <Grid container spacing={3}>
                {feedbacks.map((feedback) => (
                    <Grid item xs={12} sm={6} md={4} key={feedback.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{feedback.user_name}</Typography>
                                <Typography variant="body1">{feedback.comment}</Typography>
                                <Typography variant="body1">Rating: {feedback.rating}</Typography>
                                <Box mt={2}>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(feedback.id, feedback.comment, feedback.rating)}>
                                        Edit
                                    </Button>
                                    <Button variant="contained" color="secondary" onClick={() => handleDelete(feedback.id)}>
                                        Delete
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {editFeedback.id && (
                <Box mt={5}>
                    <Typography variant="h5">Edit Feedback</Typography>
                    <TextField
                        label="Comment"
                        value={editFeedback.comment}
                        onChange={(e) => setEditFeedback({ ...editFeedback, comment: e.target.value })}
                        fullWidth
                        multiline
                    />
                    <TextField
                        label="Rating"
                        value={editFeedback.rating}
                        onChange={(e) => setEditFeedback({ ...editFeedback, rating: e.target.value })}
                        fullWidth
                        type="number"
                    />
                    <Box mt={2}>
                        <Button variant="contained" color="primary" onClick={handleSaveEdit}>
                            Save Changes
                        </Button>
                    </Box>
                </Box>
            )}

            <Typography variant="h5" gutterBottom>Manage Reservations</Typography>
            <Grid container spacing={3}>
                {reservations.map((reservation) => (
                    <Grid item xs={12} sm={6} md={4} key={reservation.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6">{reservation.first_name} {reservation.last_name}</Typography>
                                <Typography variant="body1">Email: {reservation.email}</Typography>
                                <Typography variant="body1">Check-in: {new Date(reservation.check_in_date).toLocaleDateString()}</Typography>
                                <Typography variant="body1">Check-out: {new Date(reservation.check_out_date).toLocaleDateString()}</Typography>
                                <Typography variant="body1">Status: {reservation.status}</Typography>

                                {/* Dropdown to change status */}
                                <select
                                    value={reservation.status}
                                    onChange={(e) => handleStatusChange(reservation.id, e.target.value)}
                                    style={{ marginTop: "10px", padding: "8px", fontSize: "1rem" }}
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Approved">Approved</option>
                                    <option value="Cancelled">Cancelled</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <div>
                <LoginButton /> 
            </div>

        </Container>
    );
};

export default AdminPage;
