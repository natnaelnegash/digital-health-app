import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { getMyPatients } from '../api/userApi';
import { Link } from 'react-router-dom';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Loader2, UserPlus } from 'lucide-react';

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
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
      );
    if (error) return <p className="text-center text-red-500 py-10">Error: {error}</p>;
    if (patients.length == 0)
      return (
        <div className="text-center py-10">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <UserPlus strokeWidth={1} />
          </div>
          <h3 className="mt-2 text-xl font-semibold">No Patients Yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Your patient list will populate here as they book appointments with you.
          </p>
        </div>
      );

    return (
      // <table>
      //   <thead>
      //     <tr>
      //       <th>Name</th>
      //       <th>email</th>
      //       <th>Actions</th>
      //     </tr>
      //   </thead>
      //   <tbody>
      //     {patients.map((patients) => (
      //       <tr key={patients.id}>
      //         <Link to={`/patient/${patients.id}`}>
      //           <div>
      //             <td>
      //               {patients.firstname || ''} {patients.lastname || ''}
      //             </td>
      //             <td>{patients.email || ''}</td>
      //             <td>
      //               <Link to={`/patient/${patients.id}`}>View History</Link>
      //             </td>
      //           </div>
      //         </Link>
      //       </tr>
      //     ))}
      //   </tbody>
      // </table>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="font-medium">
                {patient.firstname || ''} {patient.lastname || ''}
              </TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link to={`/patient/${patient.id}`}>View History</Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    // <div>
    //   <h2>MyPatients</h2>
    //   {renderContent()}
    // </div>
    <div className="max-w-4xl mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>
            <p className="text-3xl font-bold">My Patients</p>
          </CardTitle>
          <CardDescription>
            A list of all unique patients who have scheduled an appointment with you.
          </CardDescription>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
};

export default MyPatientsPage;
