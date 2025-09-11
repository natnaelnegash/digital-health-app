import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import { Link } from 'react-router-dom';
import { fetchProviders } from '../features/users/userSlice';
import { useDebounce } from '../hooks/useDebounce';
import { ProviderGridSkeleton } from '@/features/users/ProviderCardSkeleton';

const FindProviders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, providers, error } = useSelector((state: RootState) => state.users);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    dispatch(fetchProviders({ search: debouncedSearchTerm, specialty: selectedSpecialty }));
  }, [dispatch, debouncedSearchTerm, selectedSpecialty]);

  const specialties = useMemo(() => {
    const allSpecialties = providers.map((p) => p.speciality).filter(Boolean);
    return [...new Set(allSpecialties)];
  }, [providers]);

  const renderContent = () => {
    if (isLoading) {
      return (
        // <div className="flex justify-center items-center h-64">
        //   <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        // </div>
        <ProviderGridSkeleton />
      );
    }

    if (error) {
      return <div className="text-center text-red-500">{error}</div>;
    }

    if (providers.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold">No Providers Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter criteria.</p>
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((prov) => (
            <Card key={prov.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>
                  Dr. {prov.firstname || ''} {prov.lastname || ''}
                </CardTitle>
                {prov.speciality && (
                  <CardDescription>
                    <Badge variant="secondary">{prov.speciality}</Badge>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-gray-600 line-clamp-3">
                  {prov.bio || 'No biography available.'}
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="default" asChild className="w-full text-white">
                  <Link to={`/provider/${prov.id}`} className="text-white">
                    View Profile & Book
                  </Link>
                </Button>
              </CardFooter>
              {/* <div key={prov.id} style={{ border: '1px solid #ccc', padding: '1rem' }}>
                <h3>
                  Dr. {prov.firstname || ''} {prov.lastname || ''}
                </h3>
                <h4>Email: {prov.email || ''}</h4>

                <Link to={`/provider/${prov.id}`}>
                  <button>View Profile</button>
                </Link>
              </div> */}
            </Card>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Find Your Provider
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Search for a specialist and book your appointment today.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div>
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by specialty"></SelectValue>
            </SelectTrigger>
            <SelectContent>
              {specialties.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default FindProviders;
