import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-gray-100 rounded-2xl h-full flex flex-col">
      <Skeleton className="h-[170px] w-full rounded-none" />
      <CardContent className="p-4 flex-1 flex flex-col space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        
        <div className="flex items-center gap-2 mt-auto">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-24" />
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-3 w-8" />
        </div>
        
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
