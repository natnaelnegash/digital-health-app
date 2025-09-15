import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
// import './App.css';
import LoginPage from './pages/LoginPage';
// import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import NewAppointmentPage from './pages/NewAppointmentPage';

// const HomePage = () => <h1>Welcome to the Digital Health App!</h1>;
// const DashboardPage = () => <h1>Your Appointments Dashboard</h1>;

function App() {
  return (
    <Router>
      <div>
        {/* <NavBar />
        <hr /> */}
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* <Route path="/login" element={<LoginPage />} /> */}
          <Route
            path="/patient-dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="new-appointment"
            element={
              <ProtectedRoute>
                <NewAppointmentPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
