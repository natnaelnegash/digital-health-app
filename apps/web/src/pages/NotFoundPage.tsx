// src/pages/NotFoundPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react'; // An icon for the alert

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <Alert className="max-w-md">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-3xl font-bold">404 - Page Not Found</AlertTitle>
        <AlertDescription className="mt-2">
          Sorry, the page you are looking for does not exist or has been moved.
        </AlertDescription>
      </Alert>

      <Button asChild className="mt-8">
        <Link to="/">Go Back to Homepage</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
