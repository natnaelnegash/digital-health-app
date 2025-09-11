import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

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
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">Your profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* <div style={{ display: 'flex', flexDirection: 'column' }}></div> */}
        <div className="space-y-2">
          <Label>Email (read only)</Label>
          <Input type="text" id="email" name="email" value={user?.email} readOnly required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Last Name</Label>
          <Input
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
            <div className="space-y-2">
              <Label htmlFor="speciality">Speciality</Label>
              <Input
                type="text"
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleChange}
                placeholder="e.g Cardiology"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={5}
                placeholder="Tell patients a little about yourslef"
              />
            </div>
          </>
        )}
        <div className="pt-4">
          <Button type="submit">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? 'Updating Profile...' : 'Update profile'}
          </Button>
        </div>
      </form>
      {error && <h4 style={{ color: 'red', fontWeight: 'bold' }}>{error}</h4>}
      {success && <h4 style={{ color: 'green', fontWeight: 'bold' }}>{success}</h4>}
    </div>
  );
};

export default ProfilePage;
