import React, { useEffect, useState } from 'react';
import { getMyPatientDetails } from '../api/patientApi';
import { Link, useParams } from 'react-router-dom';

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
import { Badge } from '@/components/ui/badge';
import { Loader2, ArrowLeft, Mail, User } from 'lucide-react';

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

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'default';
      case 'COMPLETED':
        return 'secondary';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center h-96">
          <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
        </div>
      );
    if (!patient) {
      return <p className="text-center">Patient data not found.</p>;
    }
    if (error) return <p>{error}</p>;

    return (
      // <>
      //   <div>
      //     <strong>Name: </strong>
      //     <p>
      //       {patient.firstname || ''} {patient.lastname || ''}
      //     </p>
      //     <strong>email: </strong>
      //     <p>{patient.email || ''} </p>
      //   </div>
      //   <div>
      //     <table>
      //       <thead>
      //         <tr>Date</tr>
      //         <tr>Status</tr>
      //         <tr>Action</tr>
      //       </thead>
      //       <tbody>
      //         {appointments.length > 0 ? (
      //           appointments.map((appt) => (
      //             <tr key={appt.id}>
      //               <td>{appt.startTime}</td>
      //               <td>{appt.status}</td>
      //               <td>
      //                 <Link to={`/appointments/${appt.id}`}>View appointment detail</Link>
      //               </td>
      //             </tr>
      //           ))
      //         ) : (
      //           <p>No appointment histroy with this patient</p>
      //         )}
      //       </tbody>
      //     </table>
      //   </div>
      // </>
      <div className="max-w-4xl mx-auto py-10">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/my-patients">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Patient List
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* --- LEFT COLUMN (Patient Info Card) --- */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-200 rounded-full p-3">
                    <User className="h-6 w-6 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle>
                      {patient.firstname} {patient.lastname}
                    </CardTitle>
                    <CardDescription>Patient Profile</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{patient.email}</span>
                </div>
                {/* --- Static Placeholder Data --- */}
                <div className="flex items-center">
                  <p className="mr-2 h-4 w-4 text-gray-500">📞</p>{' '}
                  {/* Using emoji as a simple icon */}
                  <span className="text-sm text-gray-700">(251) 92-123-4567</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- RIGHT COLUMN (Appointment History) --- */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Appointment History</CardTitle>
                <CardDescription>
                  All past and upcoming appointments with this patient.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments?.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appt: any) => (
                        <TableRow key={appt.id}>
                          <TableCell className="font-medium">
                            {new Date(appt.startTime).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="outline" size="sm">
                              <Link to={`/appointments/${appt.id}`}>View / Edit Note</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    This patient has no appointment history with you.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Patient Details
      </h2>
      {/* <h2>MyPatientDetails</h2> */}
      {renderContent()}
    </div>
  );
};

export default MyPatientDetails;
