"use client";

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function CourseManageRoot() {
  const router = useRouter();
  const { courseId } = useParams();

  useEffect(() => {
    // Tự động chuyển hướng vào trang Curriculum (vì đây là trang quan trọng nhất)
    router.replace(`/tutor/dashboard/manage/${courseId}/curriculum`);
  }, [courseId, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-8 h-8 border-2 border-[#5624d0] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
