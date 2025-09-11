// src/features/providers/ProviderCardSkeleton.tsx
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const ProviderCardSkeleton = () => {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        {/* Placeholder for CardTitle */}
        <Skeleton className="h-6 w-3/4" />
        {/* Placeholder for CardDescription (Badge) */}
        <Skeleton className="h-5 w-24 mt-2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        {/* Placeholders for the bio paragraph */}
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
      <CardFooter>
        {/* Placeholder for the Button */}
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
};

// A small component to render a grid of these skeletons
export const ProviderGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProviderCardSkeleton key={index} />
      ))}
    </div>
  );
};
