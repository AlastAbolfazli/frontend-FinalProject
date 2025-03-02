import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./HomePage";
import UserPage from "./UserPage";
import ReservationPage from './ReservationPage';
import EditProfile from "./EditProfile"; 
import LoginPage from "./LoginPage"; 
import AdminPage from "./AdminPage";
import LoginButton from "./LoginButton";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/edit-profile" element={<EditProfile />} />
        <Route path="/reservation" element={<ReservationPage />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;
