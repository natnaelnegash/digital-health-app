import React, { useEffect, useState } from 'react';
import { getMyPatientDetails } from '../api/patientApi';
import { Link, useParams } from 'react-router-dom';

const MyPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      const fetchMyPatientDetails = async () => {
        try {
          const myPatientDetails = await getMyPatientDetails(id);
          setPatient(myPatientDetails?.patient);
          setAppointments(myPatientDetails?.appointments);
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMyPatientDetails();
    }
  }, [id]);

  const renderContent = () => {
    if (isLoading) return <p>Loading patient details...please wait</p>;
    if (error) return <p>{error}</p>;

    return (
      <>
        <div>
          <strong>Name: </strong>
          <p>
            {patient.firstname || ''} {patient.lastname || ''}
          </p>
          <strong>email: </strong>
          <p>{patient.email || ''} </p>
        </div>
        <div>
          <table>
            <thead>
              <tr>Date</tr>
              <tr>Status</tr>
              <tr>Action</tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((appt) => (
                  <tr key={appt.id}>
                    <td>{appt.startTime}</td>
                    <td>{appt.status}</td>
                    <td>
                      <Link to={`/appointments/${appt.id}`}>View appointment detail</Link>
                    </td>
                  </tr>
                ))
              ) : (
                <p>No appointment histroy with this patient</p>
              )}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>MyPatientDetails</h2>
      {renderContent()}
    </div>
  );
};

export default MyPatientDetails;
