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
import MyPatientsPage from './pages/MyPatientsPage';
import MyPatientDetails from './pages/MyPatientDetails';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';

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
        <Routes>
          <Route element={<Layout />}>
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
            <Route
              path="/my-patients"
              element={
                <ProtectedRoute>
                  <MyPatientsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/:id"
              element={
                <ProtectedRoute>
                  <MyPatientDetails />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
