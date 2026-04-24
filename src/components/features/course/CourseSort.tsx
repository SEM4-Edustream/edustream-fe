'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CourseSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedSort = searchParams.get('sort') || 'newest';

  const onSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', value);
    router.push(`/courses?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">Sort by:</span>
      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px] h-10 border-gray-200 rounded-lg focus:ring-indigo-500">
          <SelectValue placeholder="Newest" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price_asc">Price: Low to High</SelectItem>
          <SelectItem value="price_desc">Price: High to Low</SelectItem>
          <SelectItem value="rating">Most Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
