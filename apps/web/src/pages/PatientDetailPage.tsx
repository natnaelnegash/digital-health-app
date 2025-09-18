// src/pages/PatientDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMyPatientDetails } from '../api/patientApi';
import { getRecordsForPatient } from '../api/recordsApi'; // Import the new API function

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
import {
  Loader2,
  ArrowLeft,
  Mail,
  User,
  Stethoscope,
  FileText,
  FlaskConical,
  Pill,
} from 'lucide-react'; // Import new icons
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Import Tabs components

const PatientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patientData, setPatientData] = useState<any>(null);
  const [recordsData, setRecordsData] = useState<any>(null); // State for medical records
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchAllData = async () => {
        try {
          setIsLoading(true);
          // Fetch patient details and medical records in parallel
          const [details, records] = await Promise.all([
            getPatientDetails(id),
            getRecordsForPatient(id),
          ]);
          setPatientData(details);
          setRecordsData(records);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch patient data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllData();
    }
  }, [id]);

  // ... (getStatusVariant function is the same)

  if (isLoading) {
    // ... (loading state is the same)
  }
  if (error) {
    // ... (error state is the same)
  }
  if (!patientData) {
    // ... (no data state is the same)
  }

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="mb-6">
        <Button asChild variant="outline" size="sm">
          <Link to="/my-patients">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Patient List
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- LEFT COLUMN (Patient Info Card) --- */}
        <div className="lg:col-span-1">
          {/* ... (Patient Info Card is the same as before) ... */}
        </div>

        {/* --- RIGHT COLUMN (Tabs for Records and Appointments) --- */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="appointments">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="appointments">
                <Stethoscope className="mr-2 h-4 w-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="history">
                <FileText className="mr-2 h-4 w-4" />
                Medical History
              </TabsTrigger>
              <TabsTrigger value="labs">
                <FlaskConical className="mr-2 h-4 w-4" />
                Lab Results
              </TabsTrigger>
              <TabsTrigger value="prescriptions">
                <Pill className="mr-2 h-4 w-4" />
                Prescriptions
              </TabsTrigger>
            </TabsList>

            {/* APPOINTMENTS TAB */}
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment History</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* ... (The appointment history table from the previous version goes here) ... */}
                </CardContent>
              </Card>
            </TabsContent>

            {/* MEDICAL HISTORY TAB */}
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <CardTitle>Medical History</CardTitle>
                </CardHeader>
                <CardContent>
                  {recordsData?.medicalHistory.length > 0 ? (
                    // Display medical history data here
                    <p>Display Medical History...</p>
                  ) : (
                    <p>No medical history recorded.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* LAB RESULTS TAB */}
            <TabsContent value="labs">
              <Card>
                <CardHeader>
                  <CardTitle>Lab Results</CardTitle>
                </CardHeader>
                <CardContent>
                  {recordsData?.labResults.length > 0 ? (
                    // Display lab results data here
                    <p>Display Lab Results...</p>
                  ) : (
                    <p>No lab results recorded.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* PRESCRIPTIONS TAB */}
            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Prescriptions</CardTitle>
                </CardHeader>
                <CardContent>
                  {recordsData?.prescriptions.length > 0 ? (
                    // Display prescriptions data here
                    <p>Display Prescriptions...</p>
                  ) : (
                    <p>No prescriptions recorded.</p>
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

export default PatientDetailPage;
