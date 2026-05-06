import React from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('Course');
  return (
    <Link href={href} className="group block h-full focus:outline-none focus-visible:ring-0 outline-none focus:ring-0">
      <Card 
        className={cn(
          "overflow-hidden transition-opacity duration-200 border-none bg-transparent shadow-none rounded-none cursor-pointer h-full flex flex-col group-hover:opacity-95 ring-0 outline-none focus:ring-0 focus-visible:ring-0",
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
export function CourseCardThumbnail({ src, alt = "Thumbnail" }: { src: string, alt?: string }) {
  return (
    <div className="relative h-[135px] w-full overflow-hidden border border-gray-200 bg-gray-50">
      <Image 
        src={src || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"} 
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

// 3. Content Wrapper
export function CourseCardContent({ children, className, ...props }: React.ComponentPropsWithoutRef<typeof CardContent>) {
  return (
    <CardContent className={cn("p-0 pt-2 flex-1 flex flex-col", className)} {...props}>
      {children}
    </CardContent>
  );
}

// 4. Title
export function CourseCardTitle({ children }: { children: React.ReactNode }) {
  // Ẩn vì list mode có hiển thị title tự do phía trên
  if (!children) return null;
  return (
    <h3 className="font-bold text-[16px] leading-[1.2] text-[#1c1d1f] line-clamp-2 mb-1">
      {children}
    </h3>
  );
}

// 5. Description (Keep for compatibility if used elsewhere, but maybe hide or style it small)
export function CourseCardDescription({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-gray-600 mb-4 line-clamp-2 hidden">
      {children}
    </p>
  );
}

// 6. Author
export function CourseCardAuthor({ name }: { name: string }) {
  return (
    <div className="text-[12px] text-[#6a6f73] truncate mb-1">
      {name || 'EduStream Tutor'}
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
  const t = useTranslations('Course');
  return (
    <div className="flex items-center gap-1 mb-1">
      <span className="text-[14px] font-bold text-[#b4690e]">{value ? value.toFixed(1) : t('new')}</span>
      <div className="flex text-[#b4690e]">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3.5 h-3.5 ${(value || 0) >= star ? 'fill-[#b4690e] text-[#b4690e]' : 'fill-transparent text-[#b4690e]'}`} 
            strokeWidth={1.5} 
          />
        ))}
      </div>
      <span className="text-[12px] text-[#6a6f73] ml-1">({count ? count.toLocaleString() : 0})</span>
    </div>
  );
}

// 9. Price Component
export function CourseCardPrice({ value }: { value: number | null }) {
  const t = useTranslations('Course');
  // Mock lại giá trị gốc cho hợp lý với ảnh (không quá cao)
  const originalPrice = value ? value * 1.48 : null;

  const formatPrice = (v: number) => '₫' + v.toLocaleString('en-US');

  return (
    <div className="flex items-center gap-1.5 mt-1">
      <span className="text-[16px] font-bold text-[#1c1d1f]">
        {value === null ? t('free') : formatPrice(value)}
      </span>
      {originalPrice && (
        <span className="text-[14px] text-[#6a6f73] line-through">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

// 10. Badges
export function CourseCardBadges({ isBestSeller }: { isBestSeller?: boolean }) {
  const t = useTranslations('Course');
  if (!isBestSeller) return null;
  return (
    <div className="mt-1 flex gap-1">
      <div className="inline-block bg-[#c0e5e4] text-[#1e6055] text-[12px] font-bold px-2 py-0.5 rounded-sm">
        {t('best_seller')}
      </div>
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
CourseCard.Badges = CourseCardBadges;
