import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import Calendar from 'react-calendar';
import './Sample.css';
import 'react-calendar/dist/Calendar.css';
import { createAppointment } from '../features/appointments/appointmentSlice';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from '../hooks/useQueryParams';

// type ValuePiece = Date | null;
// type Value = ValuePiece | [ValuePiece, ValuePiece];

const NewAppointmentPage = () => {
  const queryParams = useQueryParams();
  // const [newDate, setNewDate] = useState<Value>();
  const [formData, setFormData] = useState({
    startTime: '',
    providerId: '',
    reason: '',
  });

  const { isLoading, error } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const providerIdFromParams = queryParams.get('providerId');
    if (providerIdFromParams) {
      setFormData((prevData) => ({ ...prevData, providerId: providerIdFromParams }));
    }
  }, [queryParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const appointmentData = {
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
    };
    dispatch(createAppointment(appointmentData))
      .unwrap()
      .then(() => {
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log('Failed to create appointment ', error.message);
      });
  };

  return (
    <div>
      <h1>Create new Appointment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="providerId">Provider ID</label>
          <input
            type="text"
            id="providerId"
            name="providerId"
            value={formData.providerId}
            onChange={handleChange}
            required
          />
          {/* In a real app, this would be a dropdown from a search result */}
        </div>
        <div>
          <label htmlFor="startTime">Appointment Time</label>
          <input
            type="datetime-local" // A handy input type for date and time
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="reason">Reason for Visit</label>
          <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
      {/* <Calendar onChange={handleChange} value={formData.startTime} /> */}
    </div>
  );
};

export default NewAppointmentPage;
