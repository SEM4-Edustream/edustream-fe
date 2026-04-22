"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CourseManageRootPage() {
  const router = useRouter();
  const { courseId } = useParams();

  useEffect(() => {
    // Default to curriculum or basics page
    router.push(`/tutor/course/${courseId}/curriculum`);
  }, [router, courseId]);

  return null;
}
