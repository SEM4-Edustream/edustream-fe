import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure this utility exists (it comes with shadcn)

// 1. Root Component
interface CourseCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  href: string;
  children: React.ReactNode;
}
export function CourseCard({ href, children, className, ...props }: CourseCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card 
        className={cn(
          "overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 rounded-2xl cursor-pointer h-full flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </Card>
    </Link>
  );
}

// 2. Thumbnail Component
export function CourseCardThumbnail({ src, alt = "Thumbnail", isBestSeller = false }: { src: string, alt?: string, isBestSeller?: boolean }) {
  return (
    <div className="relative h-[170px] w-full overflow-hidden">
      <Image 
        src={src || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      {isBestSeller && (
        <Badge className="absolute top-4 left-4 bg-white/90 text-black shadow-sm font-semibold hover:bg-white backdrop-blur-sm z-10">
          Best Seller
        </Badge>
      )}
    </div>
  );
}

// 3. Content Wrapper
export function CourseCardContent({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof CardContent>) {
  return (
    <CardContent className={cn("p-4 flex-1 flex flex-col", className)} {...props}>
      {children}
    </CardContent>
  );
}

// 4. Title
export function CourseCardTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-semibold text-lg line-clamp-2 leading-tight mb-1.5 group-hover:text-indigo-600 transition-colors">
      {children}
    </h3>
  );
}

// 5. Description
export function CourseCardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
      {children}
    </p>
  );
}

// 6. Author
export function CourseCardAuthor({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-auto">
      <span className="text-xs font-medium text-gray-500">By</span>
      <span className="text-xs font-semibold text-gray-900">{name || 'EduStream Tutor'}</span>
    </div>
  );
}

// 7. Footer Group
export function CourseCardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-auto">
      {children}
    </div>
  );
}

// 8. Rating Component
export function CourseCardRating({ value, count }: { value: number | null, count: number }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="flex text-yellow-400">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-3.5 h-3.5 ${(value || 0) >= star ? 'fill-current' : 'text-gray-200'}`} />
        ))}
      </div>
      <span className="text-xs font-bold text-gray-900">{value ? value.toFixed(1) : 'New'}</span>
      <span className="text-xs text-gray-500">({count || 0})</span>
    </div>
  );
}

// 9. Price Component
export function CourseCardPrice({ value }: { value: number | null }) {
  return (
    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
      <span className="text-xl font-bold text-gray-900">
        {value === null ? 'Free' : new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)}
      </span>
      <span className="text-xs font-bold text-indigo-600 group-hover:underline">View Details</span>
    </div>
  );
}

// Attach Sub-components cleanly to root
CourseCard.Thumbnail = CourseCardThumbnail;
CourseCard.Content = CourseCardContent;
CourseCard.Title = CourseCardTitle;
CourseCard.Description = CourseCardDescription;
CourseCard.Author = CourseCardAuthor;
CourseCard.Footer = CourseCardFooter;
CourseCard.Rating = CourseCardRating;
CourseCard.Price = CourseCardPrice;
