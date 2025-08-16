import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, type RootState } from '../app/store';
import { fetchAppointments } from '../features/appointments/appointmentSlice';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading, error } = useSelector((state: RootState) => state.appointmemts);
  const { user } = useSelector((state: RootState) => state.auth);

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

    return (
      <>
        <ul>
          {appointments.map((appt) => (
            <li key={appt.id}>
              <strong>{new Date(appt.startTime).toLocaleString()}</strong> - {appt.reason} <br />{' '}
              {user?.role === 'PROVIDER'
                ? `With Patient: ${appt.patient.firstname} ${appt.patient.lastname}`
                : `With Provider: ${appt.provider.firstname} ${appt.provider.lastname}`}
            </li>
          ))}
        </ul>
      </>
    );
  };

  return (
    <div>
      <h2>Your Appointments Dashboard</h2>
      {renderContent()}
    </div>
  );
};

export default DashboardPage;
