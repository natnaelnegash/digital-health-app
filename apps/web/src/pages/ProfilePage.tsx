import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import { updateMyProfile } from '../api/userApi';
import { jwtDecode } from 'jwt-decode';
import { authSuccess } from '../features/auth/authSlice';

const ProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>();
  const [success, setSuccess] = useState<string | null>();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [formData, setFormdata] = useState({
    firstname: '',
    lastname: '',
    speciality: '',
    bio: '',
  });

  useEffect(() => {
    if (user) {
      setFormdata({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        speciality: user.speciality || '',
        bio: user.bio || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormdata({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updatedProfile = await updateMyProfile(formData);
      if (token) {
        const decodedUser: any = jwtDecode(token);
        dispatch(authSuccess({ user: { ...decodedUser, ...updatedProfile }, token }));
      }
    } catch (error: any) {
      setError(error.message || 'Couldnt update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <h4>Loading profile... please wait</h4>;
  }

  return (
    <div>
      <h1>Your profile</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>
            <label>Email</label>
            <input type="text" id="email" name="email" value={user?.email} readOnly required />
          </div>
          <div>
            <label>First Name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </div>
          {user.role === 'PROVIDER' && (
            <>
              <div>
                <label htmlFor="speciality">Speciality</label>
                <input
                  type="text"
                  id="speciality"
                  name="speciality"
                  value={formData.speciality}
                  onChange={handleChange}
                  placeholder="e.g Cardiology"
                  required
                />
              </div>
              <div>
                <label>Bio</label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tell patients a little about yourslef"
                  required
                />
              </div>
            </>
          )}
        </div>
        <button type="submit">{isLoading ? 'Updating Profile...' : 'Update profile'}</button>
      </form>
      {error && <h4 style={{ color: 'red', fontWeight: 'bold' }}>{error}</h4>}
      {success && <h4 style={{ color: 'green', fontWeight: 'bold' }}>{success}</h4>}
    </div>
  );
};

export default ProfilePage;
