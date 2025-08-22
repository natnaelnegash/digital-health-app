import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import { fetchAppointments, cancelAppointment } from '../features/appointments/appointmentSlice';
import { Link } from 'react-router-dom';
import './NewAppointment.css';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading, error } = useSelector((state: RootState) => state.appointments);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId));
    }
  };

  useEffect(() => {
    dispatch(fetchAppointments());
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

    return (
      // <>
      //   <ul>
      //     {appointments.map((appt) => (
      //       <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      //         <li key={appt.id}>
      //           <strong>{new Date(appt.startTime).toLocaleString()}</strong> - {appt.reason} <br />{' '}
      //           {user?.role === 'PROVIDER'
      //             ? `With Patient: ${appt.patient.firstname} ${appt.patient.lastname}`
      //             : `With Provider: ${appt.provider.firstname} ${appt.provider.lastname}`}
      //         </li>
      //         <span style={{ color: appt.status == 'CANCELLED' ? 'red' : 'green' }}>
      //           {appt.status}
      //         </span>
      //         {appt.status !== 'CANCELLED' ? (
      //           <span>
      //             <button
      //               onClick={() => handleCancelAppointment(appt.id)}
      //               style={{ backgroundColor: 'red', color: 'white' }}
      //             >
      //               Cancel
      //             </button>
      //           </span>
      //         ) : (
      //           <span>
      //             <button onClick={() => {}} style={{ backgroundColor: 'green', color: 'white' }}>
      //               Reshedule
      //             </button>
      //           </span>
      //         )}
      //       </div>
      //     ))}
      //   </ul>
      // </>
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
                  <strong>{new Date(appt.startTime).toLocaleString()}</strong> - {appt.reason}
                  <br />
                  {user?.role === 'PROVIDER'
                    ? `With Patient: ${appt.patient.firstName || ''} ${appt.patient.lastName || ''}`
                    : // Correcting a potential bug: The backend might not send firstName/lastName, so we check.
                      `With Provider: Dr. ${appt.provider.firstName || ''} ${appt.provider.lastName || ''}`}
                  {/* The Cancel Button */}
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
                  <strong>{new Date(appt.startTime).toLocaleString()}</strong> - Status:{' '}
                  {appt.status === 'SCHEDULED' ? 'MISSED' : 'SCHEDULED'}
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
