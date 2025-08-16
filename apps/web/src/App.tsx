import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';

const HomePage = () => <h1>Welcome to the Digital Health App!</h1>;
// const DashboardPage = () => <h1>Your Appointments Dashboard</h1>;

function App() {
  return (
    <Router>
      <div>
        {/* <nav>
          <ul style={{ display: 'flex', justifyContent: 'space-between' }}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav> */}
        <NavBar />
        <hr />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
