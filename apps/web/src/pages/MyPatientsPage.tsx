import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { getMyPatients } from '../api/userApi';
import { Link } from 'react-router-dom';

const MyPatientsPage = () => {
  const user = useSelector((state: RootState) => state.auth);
  const [patients, setPatients] = useState<any[]>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyPatients = async () => {
      try {
        const myPatients = await getMyPatients();
        setPatients(myPatients);
      } catch (error: any) {
        setError(error.message || 'Failed to fetcch');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyPatients();
  }, []);

  const renderContent = () => {
    if (isLoading) return <p>Loading your patients...please wait</p>;
    if (error) return <p>{error}</p>;
    if (patients.length == 0) return <p>No patients under your care</p>;

    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patients) => (
            <tr key={patients.id}>
              <Link to={`/patient/${patients.id}`}>
                <div>
                  <td>
                    {patients.firstname || ''} {patients.lastname || ''}
                  </td>
                  <td>{patients.email || ''}</td>
                  <td>
                    <Link to={`/patient/${patients.id}`}>View History</Link>
                  </td>
                </div>
              </Link>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div>
      <h2>MyPatients</h2>
      {renderContent()}
    </div>
  );
};

export default MyPatientsPage;
