import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchProviderById } from '../api/userApi';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Clock, Stethoscope, Mail } from 'lucide-react';

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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  if (!provider) return <p>Provider not found.</p>;
  if (error) return <p>{error}.</p>;

  const officeHours = [
    { day: 'Monday - Friday', time: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', time: '10:00 AM - 2:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ];

  const servicesOffered = [
    'General Consultation',
    'Annual Physical Exams',
    'Preventive Care',
    'Chronic Disease Management',
    'Specialist Referrals',
  ];

  return (
    // <div>
    //   <h2>
    //     Dr. {provider.firstname} {provider.lastname}
    //   </h2>
    //   <p>
    //     <strong>Specialty:</strong> {provider.speciality || 'N/A'}
    //   </p>
    //   <hr />
    //   <h3>About Dr. {provider.lastName}</h3>
    //   <p style={{ whiteSpace: 'pre-wrap' }}>{provider.bio || 'No biography available.'}</p>
    //   <hr />
    //   <Link to={`/book-appointment?providerId=${provider.id}`}>
    //     <button style={{ marginTop: '1rem' }}>Book an Appointment</button>
    //   </Link>
    // </div>
    <div className="max-w-6xl mx-auto py-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN (Image & Bio) --- */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <img
                src={provider.profilePictureUrl || '../../public/male_doctor.webp'} // Use real URL or fallback to placeholder
                alt={`Dr. ${provider.firstname} ${provider.lastname}`}
                className="w-full h-auto rounded-lg object-cover aspect-auto"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About Dr. {provider.lastname}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">
                {provider.bio || 'No biography available.'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN (Details & Actions) --- */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Dr. {provider.firstname} {provider.lastname}
            </h1>
            {provider.specialty && <Badge className="mt-2 text-md">{provider.specialty}</Badge>}
          </div>

          <div className="pt-4">
            <Button asChild size="lg" className="w-full md:w-auto">
              <Link to={`/book-appointment?providerId=${provider.id}`}>Book an Appointment</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-gray-600" /> Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="self-center">
              <div className="flex flex-col items-start">
                <p className="text-gray-800">Email {provider.email}</p>
                {/* Static placeholder for phone number */}
                <p className="text-gray-800 mt-2">Phone (+251)9 2456-7890</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="mr-2 h-5 w-5 text-gray-600" /> Office Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-gray-800">
                {officeHours.map((item) => (
                  <li key={item.day} className="flex justify-between">
                    <span>{item.day}</span>
                    <span className="font-medium">{item.time}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Stethoscope className="mr-2 h-5 w-5 text-gray-600" /> Services Offered
              </CardTitle>
            </CardHeader>
            <CardContent className="self-center">
              <ul className="list-disc list-inside space-y-1 text-gray-800">
                <div className="flex flex-col items-start">
                  {servicesOffered.map((service) => (
                    <li key={service}>{service}</li>
                  ))}
                </div>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailsPage;
