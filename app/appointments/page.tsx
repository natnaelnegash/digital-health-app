"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AppointmentsPage() {
  const [patientId, setPatientId] = useState("");
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: parseInt(patientId),
          date,
          doctor,
        }),
      });

      if (!res.ok) throw new Error("Failed to add appointment");

      const data = await res.json();
      setMessage(`✅ Appointment created for patient ID ${data.patientId}`);
      setPatientId("");
      setDate("");
      setDoctor("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error creating appointment");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add Appointment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="patientId">Patient ID</Label>
              <Input
                id="patientId"
                type="number"
                placeholder="Enter patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="doctor">Doctor</Label>
              <Input
                id="doctor"
                type="text"
                placeholder="Enter doctor’s name"
                value={doctor}
                onChange={(e) => setDoctor(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Save Appointment
            </Button>
          </form>

          {message && <p className="mt-4 text-sm text-center">{message}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
