import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';
import LoginPage from './pages/LoginPage';
import NavBar from './components/NavBar';
import ProtectedRoute from './components/ProtectedRoute';
import NewAppointmentPage from './pages/NewAppointmentPage';
import FindProviders from './components/FindProviders';
import ProfilePage from './pages/ProfilePage';
import AppointmentDetailsPage from './pages/AppointmentDetailsPage';
import { Toaster } from 'react-hot-toast';
import ProviderDetailsPage from './pages/ProviderDetailsPage';

const HomePage = () => <h1>Welcome to the Digital Health App!</h1>;
// const DashboardPage = () => <h1>Your Appointments Dashboard</h1>;

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
      <div style={{ width: '90vw' }}>
        <NavBar />
        <hr />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/providers" element={<FindProviders />} />
          <Route path="/provider/:id" element={<ProviderDetailsPage />} />
          <Route path="/appointments/:id" element={<AppointmentDetailsPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="book-appointment"
            element={
              <ProtectedRoute>
                <NewAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
