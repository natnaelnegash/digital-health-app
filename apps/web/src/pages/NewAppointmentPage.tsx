import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import './Sample.css';
import 'react-calendar/dist/Calendar.css';
import { createAppointment } from '../features/appointments/appointmentSlice';
import { useNavigate } from 'react-router-dom';
import { useQueryParams } from '../hooks/useQueryParams';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
  const now = new Date();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<any>(now.toLocaleTimeString());

  const { isLoading, error } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (date) {
      setFormData({ ...formData, startTime: date.toString() });
    }
    // if (time) {
    //   set;
    // }

    console.log(formData.startTime);
    console.log(time);
  }, [date]);

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
        toast.success('Appointment booked successfully!');
        navigate('/dashboard');
      })
      .catch((error) => {
        toast.error(`Booking failed: ${error}`);
        console.log('Failed to create appointment ', error.message);
      });
  };

  return (
    <div className="items-center justify-center flex flex-col">
      <h1>Create new Appointment</h1>
      <form onSubmit={handleSubmit} className="w-3/4 gap-4 flex flex-col ">
        <div className="flex flex-col gap-4">
          <Label htmlFor="providerId">Provider ID</Label>
          <Input
            className="w-1/3"
            type="text"
            id="providerId"
            name="providerId"
            value={formData.providerId}
            onChange={handleChange}
            required
          />
          {/* In a real app, this would be a dropdown from a search result */}
        </div>
        <div className="flex justify-between ">
          <div className="flex gap-5">
            <div className=" flex flex-col gap-4">
              <Label htmlFor="startTime">Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-lg border-3 "
                disabled={(date) => date < new Date()}
                required
              />
              {/* <input
            type="datetime-local" // A handy input type for date and time
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
          /> */}
            </div>
            <div className=" flex flex-col gap-4">
              <Label htmlFor="startTime">Time</Label>
              <Input
                type="time"
                id="time-picker"
                step="1"
                defaultValue="10:30:00"
                className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              className="w-[300px] border-3"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
            {/* <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} /> */}
          </div>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        <Button type="submit" className="w-[300px] self-center" disabled={isLoading}>
          {isLoading ? 'Booking...' : 'Book Appointment'}
        </Button>
      </form>
      {/* <Calendar onChange={handleChange} value={formData.startTime} /> */}
    </div>
  );
};

export default NewAppointmentPage;
