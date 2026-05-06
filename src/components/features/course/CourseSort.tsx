'use client';

import React from 'react';
import { useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CourseSort() {
  const t = useTranslations('CourseListing.Sort');
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
      <span className="text-sm font-medium text-gray-500 whitespace-nowrap">{t('label')}:</span>
      <Select value={selectedSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px] h-10 border-gray-200 rounded-lg focus:ring-indigo-500">
          <SelectValue placeholder={t('newest')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">{t('newest')}</SelectItem>
          <SelectItem value="price_asc">{t('price_asc')}</SelectItem>
          <SelectItem value="price_desc">{t('price_desc')}</SelectItem>
          <SelectItem value="rating">{t('rating')}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
