import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProviderById } from '../api/userApi';

const ProviderDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [provider, setProvider] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchProviderById(id)
        .then((data) => setProvider(data))
        .catch((error: any) => setError(error))
        .finally(() => setIsLoading(false));
    }
  }, []);

  if (isLoading) return <p>Loading provider details...</p>;
  if (!provider) return <p>Provider not found.</p>;
  if (error) return <p>{error}.</p>;

  return (
    <div>
      <h2>
        Dr. {provider.firstname} {provider.lastname}
      </h2>
      <p>
        <strong>Specialty:</strong> {provider.speciality || 'N/A'}
      </p>
      <hr />
      <h3>About Dr. {provider.lastName}</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{provider.bio || 'No biography available.'}</p>
      <hr />
      <Link to={`/book-appointment?providerId=${provider.id}`}>
        <button style={{ marginTop: '1rem' }}>Book an Appointment</button>
      </Link>
    </div>
  );
};

export default ProviderDetailsPage;
