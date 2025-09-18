// src/features/records/AddRecordForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/app/store';
import { createNewRecord } from '../patients/patientSlice';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Define a schema for our form
const recordSchema = z.object({
  recordType: z.enum(['history', 'lab', 'prescription']),
  details: z.string().min(1, 'Details are required.'),
  // These fields will be shown conditionally
  labType: z.string().optional(),
  medication: z.string().optional(),
  dosage: z.string().optional(),
});
type RecordFormValues = z.infer<typeof recordSchema>;

interface AddRecordFormProps {
  patientId: string;
  onSubmitSuccess: () => void; // A function to call on success to close the modal and refresh data
}

export const AddRecordForm: React.FC<AddRecordFormProps> = ({ patientId, onSubmitSuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const form = useForm<RecordFormValues>({
    resolver: zodResolver(recordSchema),
    defaultValues: {
      recordType: 'history',
      details: '',
    },
  });

  const recordType = form.watch('recordType'); // Watch the value of the recordType field

  const onSubmit = async (values: RecordFormValues) => {
    const recordData = {
      type: values.recordType,
      data: {
        details: values.details,
        type: values.labType, // For lab
        medication: values.medication, // For prescription
        dosage: values.dosage, // For prescription
        results: values.details, // For lab
      },
    };
    dispatch(createNewRecord({ patientId, recordData }))
      .unwrap()
      .then(() => {
        toast.success('Record added successfully!');
        onSubmitSuccess(); // Close modal and trigger data refresh
      })
      .catch((error) => {
        toast.error(`Failed to add record: ${error}`);
      });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recordType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Record Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="history">Medical History</SelectItem>
                  <SelectItem value="lab">Lab Result</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {/* Show fields based on the selected record type */}
        {recordType === 'history' && (
          <FormField
            control={form.control}
            name="details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>History Details</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {recordType === 'lab' && (
          <>
            <FormField
              control={form.control}
              name="labType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lab Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Blood Panel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Results / Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {recordType === 'prescription' && (
          <>
            <FormField
              control={form.control}
              name="medication"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Medication</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Atorvastatin" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dosage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dosage</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 20mg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit">Add Record</Button>
      </form>
    </Form>
  );
};
