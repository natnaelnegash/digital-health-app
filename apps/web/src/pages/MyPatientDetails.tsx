import React, { useEffect, useMemo, useState } from 'react';
import { getMyPatientDetails } from '../api/patientApi';
import { getRecordsForPatient } from '../api/recordsApi';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../app/store';
import { fetchPatientPageData } from '../features/patients/patientSlice';
import { AddRecordForm } from '@/features/records/AddRecordForm';
import { Separator } from '@/components/ui/separator';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import {
  Loader2,
  ArrowLeft,
  Mail,
  User,
  Stethoscope,
  FileText,
  FlaskConical,
  Pill,
  PlusCircle,
  BriefcaseMedical,
  CalendarClock,
  Activity,
  FilePlus2,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EmptyState = ({ message }: { message: string }) => (
  <div className="text-center text-gray-500 py-8">
    <p>{message}</p>
  </div>
);

const MyPatientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [appointments, setAppointments] = useState<any[]>(null);
  const {
    details: patient,
    records: records,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.patient);

  const processedRecords = useMemo(() => {
    if (!records) return null;

    // Find the single, most recent "Blood Type" lab result.
    const bloodTypeResult = records.labResults
      ?.filter((lab: any) => lab.type.toLowerCase() === 'blood type')
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Filter out the blood type from the main list of labs.
    const otherLabResults = records.labResults?.filter(
      (lab: any) => lab.type.toLowerCase() !== 'blood type',
    );

    return {
      bloodType: bloodTypeResult,
      otherLabs: otherLabResults,
      // Sort medical history by most recent first for the timeline
      history: [...records.medicalHistory].sort(
        (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
      prescriptions: records.prescriptions,
    };
  }, [records]);

  useEffect(() => {
    if (id) {
      const fetchMyPatientDetails = async () => {
        try {
          const myPatientDetails = await getMyPatientDetails(id);
          setAppointments(myPatientDetails?.appointments);
        } catch (error: any) {
          console.log(error);
        }
      };
      fetchMyPatientDetails();
      dispatch(fetchPatientPageData(id));
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
              {/* 
              <CardContent className="space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">{patient.email}</span>
                </div>
                <div className="flex items-center">
                  <p className="mr-2 h-4 w-4 text-gray-500">📞</p>{' '}
                  <span className="text-sm text-gray-700">(251) 92-123-4567</span>
                </div>
              </CardContent> 
              */}
              <CardContent>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Key Information</h4>
                <Separator />
                <div className="mt-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Blood Type</span>
                    {processedRecords?.bloodType ? (
                      <Badge variant="secondary" className="text-lg">
                        {processedRecords.bloodType.results?.description}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-400">N/A</span>
                    )}
                  </div>
                  {/* Static placeholders for other vitals */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Last Visit</span>
                    <span className="text-sm font-medium">Jan 15, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* 
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
          </div> */}

          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold">Patient Records</h3>
              {/* --- ADD RECORD BUTTON & DIALOG --- */}
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Record
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Medical Record</DialogTitle>
                  </DialogHeader>
                  <AddRecordForm
                    patientId={id!}
                    onSubmitSuccess={() => {
                      setIsAddModalOpen(false);
                      // Here you would re-fetch the records data
                    }}
                  />
                  <p>Add Record Form would go here.</p>
                </DialogContent>
              </Dialog>
            </div>
            <Tabs defaultValue="appointments">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="history">
                  <FileText className="mr-2 h-4 w-4 hidden md:inline-flex" />
                  History
                </TabsTrigger>
                <TabsTrigger value="labs">
                  <FlaskConical className="mr-2 h-4 w-4 hidden md:inline-flex" />
                  Labs
                </TabsTrigger>
                <TabsTrigger value="prescriptions">
                  <Pill className="mr-2 h-4 w-4 hidden md:inline-flex" />
                  Scripts
                </TabsTrigger>
                <TabsTrigger value="appointments">
                  <Stethoscope className="mr-2 h-4 w-4 hidden md:inline-flex" />
                  Appointments
                </TabsTrigger>
              </TabsList>

              {/* APPOINTMENTS TAB */}
              <TabsContent value="appointments">
                <Card>
                  <CardHeader>
                    <CardTitle>Appointment History</CardTitle>
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
              </TabsContent>

              {/* MEDICAL HISTORY TAB */}
              <TabsContent value="history">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BriefcaseMedical className="mr-2" /> Medical History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processedRecords?.history?.length > 0 ? (
                      <div className="relative pl-6">
                        {/* The timeline vertical line */}
                        <div className="absolute left-0 top-0 h-full w-0.5 bg-gray-200" />
                        <div className="space-y-8">
                          {processedRecords.history.map((rec: any) => (
                            <div key={rec.id} className="relative">
                              <div className="absolute -left-[35px] top-1 h-4 w-4 rounded-full bg-indigo-500 ring-4 ring-white" />
                              <p className="font-semibold text-gray-800">
                                {new Date(rec.date).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </p>
                              <p className="mt-1 text-gray-600">{rec.details}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <EmptyState message="No medical history recorded." />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LAB RESULTS TAB */}
              <TabsContent value="labs">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FlaskConical className="mr-2" /> Lab Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processedRecords?.otherLabs?.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Test Type</TableHead>
                            <TableHead>Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {processedRecords.otherLabs.map((rec: any) => (
                            <TableRow key={rec.id}>
                              <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                              <TableCell>{rec.type}</TableCell>
                              <TableCell>{rec.results?.description}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <EmptyState message="No other lab results recorded." />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PRESCRIPTIONS TAB */}
              <TabsContent value="prescriptions">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Pill className="mr-2" /> Prescriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {processedRecords?.prescriptions?.length > 0 ? (
                      <div className="space-y-4">
                        {processedRecords.prescriptions.map((rec: any) => (
                          <div key={rec.id} className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-lg">{rec.medication}</span>
                              <Badge>Active</Badge>
                            </div>
                            <p className="text-gray-600">{rec.dosage}</p>
                            <p className="text-sm text-gray-400 mt-2">
                              Prescribed on: {new Date(rec.date).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyState message="No prescriptions recorded." />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
