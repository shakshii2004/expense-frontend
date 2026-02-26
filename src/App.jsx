import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddExpense from "./pages/AddExpense.jsx";
import Settlements from "./pages/Settlements.jsx";
import Groups from "./pages/Groups.jsx";
import History from "./pages/History.jsx";
import { setAuthToken } from "./api";

// Auto set token if exists
const token = localStorage.getItem("token");
if (token) {
  setAuthToken(token);
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/settlements" element={<Settlements />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}
