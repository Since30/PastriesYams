import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/HomePages';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Contact from './pages/Contact';
import YamsGame from './pages/YamsGame';
import Dashboard from './pages/admin/Dashboard';
import PastryManagement from './pages/admin/PastryManagement';
import UserList from './pages/admin/UserList';
import MessageList from './pages/admin/MessageList';
import { AuthProvider } from './pages/auth/AuthContext';
import './assets/CSS/App.css'
import ProtectedRoute from './services/ProtectedRoutes';


const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/yams-game" element={<YamsGame/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard/*" element={<ProtectedRoute role="admin"><Dashboard><></></Dashboard></ProtectedRoute>} />
        <Route path="/dashboard/pastry" element={<Dashboard><PastryManagement /></Dashboard>} />
        <Route path="/dashboard/users" element={<Dashboard><UserList /></Dashboard>} />
        <Route path="/dashboard/messages" element={<Dashboard><MessageList /></Dashboard>} />
      </Routes> 
      </AuthProvider>
    </Router>
  );
};

export default App;
