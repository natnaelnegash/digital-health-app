import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import Calendar from 'react-calendar';
import './Sample.css';
import 'react-calendar/dist/Calendar.css';
import { createAppointment } from '../api/appointmentApi';
import { useNavigate } from 'react-router-dom';
import {
  appointmentFailure,
  appointmentStart,
  appointmentSuccess,
} from '../features/appointments/appointmentSlice';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const NewAppointmentPage = () => {
  const [newDate, setNewDate] = useState<Value>();
  const [formData, setFormData] = useState({
    startDate: newDate,
    provider: '',
    reason: '',
  });
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.appointments);
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setFormData({ ...formData, startDate: newDate });
  }, [newDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(appointmentStart());
    try {
      const data = await createAppointment(formData);
      dispatch(appointmentSuccess());
      navigate('/dashboard');
    } catch (error: any) {
      const errorMessage = error.response.data.message || 'Failed to book an appointment ';
      appointmentFailure(errorMessage);
    }
  };

  return (
    <div>
      <h1>Create new Appointment</h1>
      <Calendar onChange={setNewDate} value={newDate} />
    </div>
  );
};

export default NewAppointmentPage;
