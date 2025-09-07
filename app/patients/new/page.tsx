"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AddPatientPage() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          age: parseInt(age),
          condition,
        }),
      });

      if (!res.ok) throw new Error("Failed to add patient");
      const data = await res.json();

      setMessage(`✅ Patient added: ${data.name} (ID: ${data.id})`);
      setName("");
      setAge("");
      setCondition("");
    } catch (error) {
      console.error(error);
      setMessage("❌ Error adding patient");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Add New Patient</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter patient's name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="condition">Condition</Label>
              <Input
                id="condition"
                type="text"
                placeholder="Enter condition"
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Save Patient
            </Button>
          </form>

          {message && (
            <p className="mt-4 text-sm text-center">{message}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
