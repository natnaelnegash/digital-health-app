import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import { fetchAppointments, cancelAppointment } from '../features/appointments/appointmentSlice';
import { Link } from 'react-router-dom';
import './NewAppointment.css';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading, error } = useSelector((state: RootState) => state.appointments);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId))
        .unwrap()
        .then(() => toast.success('Appointment cancelled.'))
        .catch((error) => toast.error(`Error: ${error}`));
    }
  };

  useEffect(() => {
    dispatch(fetchAppointments());
    console.log(appointments);
  }, [dispatch]);

  const renderContent = () => {
    if (isLoading) {
      return <p>Loading appointments please wait...</p>;
    }

    if (error) {
      return <p style={{ color: 'red' }}>Error: {error}</p>;
    }

    if (appointments.length === 0) {
      return <p>You have no pending appointments</p>;
    }

    const now = new Date();
    const scheduledAppointments = appointments.filter(
      (appt) => appt.status === 'SCHEDULED' && appt.startTime > now.toISOString(),
    );

    const pastOrCancelledAppointments = appointments.filter(
      (appt) => appt.status !== 'SCHEDULED' || appt.startTime < now.toISOString(),
    );

    const appointmentContent = (appt) => (
      <>
        <strong>{new Date(appt.startTime).toLocaleString()}</strong> - {appt.reason}
        <br />
        {user?.role === 'PROVIDER'
          ? `With Patient: ${appt?.patient?.firstName || ''} ${appt?.patient?.lastName || ''}`
          : // Correcting a potential bug: The backend might not send firstName/lastName, so we check.
            `With Provider: Dr. ${appt?.provider?.firstName || ''} ${appt?.provider?.lastName || ''}`}
        {/* The Cancel Button */}
      </>
    );

    return (
      <div
        className="appointment-container"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <h3>Upcoming Appointments</h3>
          {scheduledAppointments.length > 0 ? (
            <ul>
              {scheduledAppointments.map((appt) => (
                <li
                  key={appt.id}
                  style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '10px' }}
                >
                  <Link to={`/appointments/${appt.id}`} style={{ color: 'black' }}>
                    {appointmentContent(appt)}
                  </Link>
                  <button
                    onClick={() => handleCancelAppointment(appt.id)}
                    style={{
                      marginLeft: '20px',
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '5px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>You have no scheduled appointments.</p>
          )}
        </div>

        <hr style={{ margin: '2rem 0', transform: 'revert', height: 'full' }} />
        <div>
          <h3>History</h3>
          {pastOrCancelledAppointments.length > 0 ? (
            <ul>
              {pastOrCancelledAppointments.map((appt) => (
                <li key={appt.id} style={{ color: '#666' }}>
                  <Link to={`/appointments/${appt.id}`} style={{ color: 'black' }}>
                    {appointmentContent(appt)}
                    {appt.status === 'SCHEDULED' ? 'MISSED' : 'SCHEDULED'}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointment history.</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Your Appointments Dashboard</h1>
      <Link to="/book-appointment">
        <button>+ Book New Appointment</button>
      </Link>
      {renderContent()}
    </div>
  );
};

export default DashboardPage;
