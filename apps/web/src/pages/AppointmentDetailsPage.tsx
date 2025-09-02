import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import {
  clearSelectedAppointment,
  fetchAppointmentDetails,
  saveAppointmentNote,
} from '../features/appointments/appointmentSlice';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const AppointmentDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAppointment, isLoading, error } = useSelector(
    (state: RootState) => state.appointments,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentDetails(id));
    }

    return () => {
      dispatch(clearSelectedAppointment());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedAppointment?.clinicalNote) {
      setNoteContent(selectedAppointment.clinicalNote.note);
    } else {
      setNoteContent('');
    }
  }, [selectedAppointment]);

  const handleSaveNote = () => {
    if (id) {
      dispatch(saveAppointmentNote({ appointmentId: id, content: noteContent }))
        .unwrap()
        .then(() => toast.success('Clinical note saved successfully'))
        .catch((error) => toast.error(`Failed to save clinical note: ${error.message}`));
    }
  };

  if (isLoading || !selectedAppointment) {
    return <p>Loading appointment details...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  const { patient, provider } = selectedAppointment;

  return (
    <div>
      <h2>Appointment Details</h2>
      <div style={{ display: 'flex', width: '100%', position: 'relative' }}>
        <div
          style={{
            width: '45%',
            placeItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'start',
              // alignItems: 'center',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '10px',
                // border: '2px solid black',
                justifyContent: 'start',
                placeItems: 'center',
              }}
            >
              <strong>Start Time: </strong>
              <p> {new Date(selectedAppointment.startTime).toLocaleString()}</p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                // border: '2px solid black',
                justifyContent: 'start',
                placeItems: 'center',
              }}
            >
              <strong>Booker: </strong>
              <p>
                {patient.firstname} {patient.lastname}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                // border: '2px solid black',
                justifyContent: 'start',
                placeItems: 'center',
              }}
            >
              <strong>Booked with: </strong>
              <p>
                Dr. {provider.firstname} {provider.lastname}
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                gap: '10px',
                // border: '2px solid black',
                justifyContent: 'start',
                placeItems: 'center',
              }}
            >
              <strong>Reason(if any): </strong>
              <p>{selectedAppointment.reason}</p>
            </div>
          </div>
        </div>

        <hr />
        <div
          style={{
            justifyContent: 'start',
            position: 'relative',
            width: '45%',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <strong>Clinical Note </strong>
            <textarea
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              rows={10}
              style={{
                padding: '10px',
                backgroundColor: 'white',
                border: '2px black solid',
                borderRadius: '8px',
              }}
            />
          </div>
          {user?.role === 'PROVIDER' && (
            <button onClick={handleSaveNote} disabled={isLoading}>
              {isLoading ? 'Submitting' : 'Submit clinical note'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
