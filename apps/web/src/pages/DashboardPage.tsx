import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, PlusCircle, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import { fetchAppointments, cancelAppointment } from '../features/appointments/appointmentSlice';
import { Link, useNavigate } from 'react-router-dom';
import './NewAppointment.css';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { appointments, isLoading, error } = useSelector((state: RootState) => state.appointments);
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      dispatch(cancelAppointment(appointmentId))
        .unwrap()
        .then(() => toast.success('Appointment cancelled.'))
        .catch((error) => toast.error(`Error: ${error}`));
    }
  };

  useEffect(() => {
    dispatch(fetchAppointments());
    console.log(appointments);
  }, [dispatch]);

  const getStatusVariant = (status) => {
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
    if (isLoading && appointments.length === 0) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-30 w-30 animate-spin text-gray-500" />
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }

    if (appointments.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold">No Appointments Yet</h3>
          <p className="text-gray-500 mt-2 mb-4">Get started by booking your first appointment.</p>
          <Button onClick={() => navigate('/providers')}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Find a Provider
          </Button>
        </div>
      );
    }

    const now = new Date();
    const scheduledAppointments = appointments.filter(
      (appt) => appt.status === 'SCHEDULED' && appt.startTime > now.toISOString(),
    );

    const pastOrCancelledAppointments = appointments.filter(
      (appt) => appt.status !== 'SCHEDULED' || appt.startTime < now.toISOString(),
    );

    const appointmentContent = (appt) => (
      <>
        <strong>{new Date(appt.startTime).toLocaleString()}</strong> - {appt.reason}
        <br />
        {user?.role === 'PROVIDER'
          ? `With Patient: ${appt?.patient?.firstName || ''} ${appt?.patient?.lastName || ''}`
          : // Correcting a potential bug: The backend might not send firstName/lastName, so we check.
            `With Provider: Dr. ${appt?.provider?.firstName || ''} ${appt?.provider?.lastName || ''}`}
        {/* The Cancel Button */}
      </>
    );

    return (
      <div
        className="appointment-container"
        style={{ display: 'flex', justifyContent: 'space-between' }}
      >
        <div>
          <h2 className="font-bold pb-4">Upcoming Appointments</h2>
          {scheduledAppointments.length > 0 ? (
            <Card className="max-h-[300px]">
              <CardContent className="p-0 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{user?.role === 'PROVIDER' ? 'Patient' : 'Provider'}</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledAppointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell className="font-medium">
                          {user?.role === 'PROVIDER'
                            ? `${appt.patient.firstname || ''} ${appt.patient.lastname || ''}`
                            : `Dr ${appt.provider.firstname || ''} ${appt.provider.lastname || ''}`}
                        </TableCell>
                        <TableCell>{new Date(appt.startTime).toLocaleString()}</TableCell>
                        <TableCell>{appt.reason === '' ? '-' : appt.reason}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(appt.status)}>{appt.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="secondary" className="h-8 w-8 p-0">
                                <span className="sr-only">Open Menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => navigate(`/appointments/${appt.id}`)}
                              >
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleCancelAppointment(appt.id)}
                                className="text-red-600"
                              >
                                Cancel Appointment
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            // <ul>
            //   {scheduledAppointments.map((appt) => (
            //     <li
            //       key={appt.id}
            //       style={{ marginBottom: '1rem', border: '1px solid #ccc', padding: '10px' }}
            //     >
            //       <Link to={`/appointments/${appt.id}`} style={{ color: 'black' }}>
            //         {appointmentContent(appt)}
            //       </Link>
            //       <button
            //         onClick={() => handleCancelAppointment(appt.id)}
            //         style={{
            //           marginLeft: '20px',
            //           backgroundColor: '#f44336',
            //           color: 'white',
            //           border: 'none',
            //           padding: '5px 10px',
            //           cursor: 'pointer',
            //         }}
            //       >
            //         Cancel
            //       </button>
            //     </li>
            //   ))}
            // </ul>
            <p>You have no scheduled appointments.</p>
          )}
        </div>

        <hr style={{ margin: '2rem 0', transform: 'revert', height: 'full' }} />
        <div>
          <h2 className="font-bold pb-4">History</h2>
          {pastOrCancelledAppointments.length > 0 ? (
            <Card className="max-h-[300px]">
              <CardContent className="p-0 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{user?.role === 'PROVIDER' ? 'Patient' : 'Provider'}</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastOrCancelledAppointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>
                          {user?.role === 'PROVIDER'
                            ? `${appt.patient.firstname || ''} ${appt.patient.lastname || ''}`
                            : `${appt.provider.firstname || ''} ${appt.provider.lastname || ''}`}
                        </TableCell>
                        <TableCell>{new Date(appt.startTime).toLocaleString()}</TableCell>
                        <TableCell>{appt.reason === '' ? '-' : appt.reason}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(appt.status)}>
                            {appt.status == 'SCHEDULED' ? 'MISSED' : appt.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/appointments/${appt.id}`)}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : (
            <p>No appointment history.</p>
          )}
          {/* {pastOrCancelledAppointments.length > 0 ? (
            <ul>
              {pastOrCancelledAppointments.map((appt) => (
                <li key={appt.id} style={{ color: '#666' }}>
                  <Link to={`/appointments/${appt.id}`} style={{ color: 'black' }}>
                    {appointmentContent(appt)}
                    {appt.status === 'SCHEDULED' ? 'MISSED' : 'CANCELED'}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointment history.</p>
          )} */}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Your Appointments Dashboard</h1>
      {user?.role === 'PATIENT' && (
        <Button onClick={() => navigate('/providers')}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      )}
      {/* <Link to="/book-appointment">
        <button>+ Book New Appointment</button>
      </Link> */}
      {renderContent()}
    </div>
  );
};

export default DashboardPage;
