import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { type AppDispatch, type RootState } from '../app/store';
import {
  clearSelectedAppointment,
  fetchAppointmentDetails,
  saveAppointmentNote,
} from '../features/appointments/appointmentSlice';
import { Link, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft, User, Calendar, Stethoscope, Save } from 'lucide-react';

const AppointmentDetailsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedAppointment, isLoading, error } = useSelector(
    (state: RootState) => state.appointments,
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const { id } = useParams<{ id: string }>();
  const [noteContent, setNoteContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAppointmentDetails(id));
    }

    return () => {
      dispatch(clearSelectedAppointment());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (selectedAppointment?.clinicalNote) {
      setNoteContent(selectedAppointment.clinicalNote.note);
    } else {
      setNoteContent('');
    }
  }, [selectedAppointment]);

  const handleSaveNote = () => {
    if (id) {
      dispatch(saveAppointmentNote({ appointmentId: id, content: noteContent }))
        .unwrap()
        .then(() => toast.success('Clinical note saved successfully'))
        .catch((error) => toast.error(`Failed to save clinical note: ${error.message}`))
        .finally(() => setIsSaving(false));
    }
  };

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

  if (isLoading || !selectedAppointment) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
      </div>
    );
  }
  if (error) {
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  }
  if (!selectedAppointment) {
    return <p className="text-center py-10">Appointment data not found.</p>;
  }

  const { patient, provider } = selectedAppointment;

  // return (
  //   <div>
  //     <h2>Appointment Details</h2>
  //     <div style={{ display: 'flex', width: '100%', position: 'relative' }}>
  //       <div
  //         style={{
  //           width: '45%',
  //           placeItems: 'center',
  //         }}
  //       >
  //         <div
  //           style={{
  //             display: 'flex',
  //             flexDirection: 'column',
  //             justifyContent: 'start',
  //             // alignItems: 'center',
  //             position: 'relative',
  //           }}
  //         >
  //           <div
  //             style={{
  //               display: 'flex',
  //               gap: '10px',
  //               // border: '2px solid black',
  //               justifyContent: 'start',
  //               placeItems: 'center',
  //             }}
  //           >
  //             <strong>Start Time: </strong>
  //             <p> {new Date(selectedAppointment.startTime).toLocaleString()}</p>
  //           </div>
  //           <div
  //             style={{
  //               display: 'flex',
  //               gap: '10px',
  //               // border: '2px solid black',
  //               justifyContent: 'start',
  //               placeItems: 'center',
  //             }}
  //           >
  //             <strong>Booker: </strong>
  //             <p>
  //               {patient.firstname} {patient.lastname}
  //             </p>
  //           </div>
  //           <div
  //             style={{
  //               display: 'flex',
  //               gap: '10px',
  //               // border: '2px solid black',
  //               justifyContent: 'start',
  //               placeItems: 'center',
  //             }}
  //           >
  //             <strong>Booked with: </strong>
  //             <p>
  //               Dr. {provider.firstname} {provider.lastname}
  //             </p>
  //           </div>
  //           <div
  //             style={{
  //               display: 'flex',
  //               gap: '10px',
  //               // border: '2px solid black',
  //               justifyContent: 'start',
  //               placeItems: 'center',
  //             }}
  //           >
  //             <strong>Reason(if any): </strong>
  //             <p>{selectedAppointment.reason}</p>
  //           </div>
  //         </div>
  //       </div>

  //       <hr />
  //       <div
  //         style={{
  //           justifyContent: 'start',
  //           position: 'relative',
  //           width: '45%',
  //         }}
  //       >
  //         <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
  //           <strong>Clinical Note </strong>
  //           <textarea
  //             name="content"
  //             value={noteContent}
  //             onChange={(e) => setNoteContent(e.target.value)}
  //             rows={10}
  //             style={{
  //               padding: '10px',
  //               backgroundColor: 'white',
  //               border: '2px black solid',
  //               borderRadius: '8px',
  //             }}
  //           />
  //         </div>
  //         {user?.role === 'PROVIDER' && (
  //           <button onClick={handleSaveNote} disabled={isLoading}>
  //             {isLoading ? 'Submitting' : 'Submit clinical note'}
  //           </button>
  //         )}
  //       </div>
  //     </div>
  //   </div>
  // );
  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          {/* Link back to the specific patient's detail page for better context */}
          <Link to={`/patient/${patient.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {patient.firstName}'s Chart
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* --- LEFT COLUMN (Appointment Vitals) --- */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Vitals</CardTitle>
              <CardDescription>Key details for this encounter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Patient</p>
                  <p className="text-sm text-gray-600">
                    {patient.firstName} {patient.lastName}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Date & Time</p>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedAppointment.startTime).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start space-x-3">
                <Stethoscope className="h-5 w-5 text-gray-500 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Reason for Visit</p>
                  <p className="text-sm text-gray-600">
                    {selectedAppointment.reason || 'Not specified'}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm font-semibold text-gray-800 mb-2">Status</p>
                <Badge variant={getStatusVariant(selectedAppointment.status)}>
                  {selectedAppointment.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* --- RIGHT COLUMN (Clinical Note Workspace) --- */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Note</CardTitle>
              <CardDescription>
                {user?.role === 'PROVIDER'
                  ? 'Document the patient encounter here. Your notes will be saved automatically.'
                  : 'Viewing notes for this appointment.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user?.role === 'PROVIDER' ? (
                <div className="space-y-4">
                  <Textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={15}
                    placeholder="Enter subjective, objective, assessment, and plan (SOAP) notes here..."
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleSaveNote} disabled={isSaving}>
                      {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Note
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-4 border rounded-md bg-gray-50 min-h-[200px]">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {noteContent || 'No clinical notes have been added for this appointment.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsPage;
