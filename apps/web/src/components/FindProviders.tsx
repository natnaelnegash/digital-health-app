import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { fetchProviders } from '../features/users/userSlice';

const FindProviders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, providers, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchProviders());
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div>Loading providers please wait</div>;
    }

    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (providers.length === 0) {
      return <div>No providers avilable</div>;
    }

    return (
      <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {providers.map((prov) => (
            <div key={prov.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
              <h3>
                Dr. {prov.firstname || ''} {prov.lastname || ''}
              </h3>
              <h4>Email: {prov.email || ''}</h4>

              <Link to={`/provider/${prov.id}`}>
                <button>View Profile</button>
              </Link>
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <div>
      <h2>Our Providers</h2>
      {renderContent()}
    </div>
  );
};

export default FindProviders;
