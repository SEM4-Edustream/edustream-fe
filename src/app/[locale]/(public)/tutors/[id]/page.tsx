'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import tutorService, { PublicTutorResponse } from '@/services/tutorService';
import { Button } from '@/components/ui/button';
import { CourseCard } from '@/components/ui/course-card';
import { 
  Users, 
  Star, 
  BookOpen, 
  PlayCircle, 
  ChevronRight,
  Loader2,
  Globe,
  Mail,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function TutorProfilePage() {
  const { id } = useParams();
  const t = useTranslations('TutorProfile');
  const [tutor, setTutor] = useState<PublicTutorResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const data = await tutorService.getPublicTutorProfile(id as string);
        setTutor(data);
      } catch (error) {
        console.error('Failed to fetch tutor profile', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTutor();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Tutor Not Found</h1>
        <Link href="/courses">
          <Button>Back to Courses</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Section */}
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src={tutor.avatarUrl || '/placeholder-avatar.png'}
                alt={tutor.fullName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
                  {tutor.fullName}
                </h1>
                <p className="text-xl md:text-2xl text-slate-300 font-medium">
                  {tutor.headline}
                </p>
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{t('stats.courses')}</p>
                    <p className="text-lg font-bold">{tutor.totalCourses}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{t('stats.reviews')}</p>
                    <p className="text-lg font-bold">{tutor.totalReviews}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">{t('stats.students')}</p>
                    <p className="text-lg font-bold">1.2k+</p> {/* Placeholder for now */}
                  </div>
                </div>
              </div>

              <div className="flex justify-center md:justify-start gap-4 pt-4">
                <Button variant="outline" className="rounded-full bg-white/5 border-white/20 hover:bg-white/10 text-white">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" className="rounded-full bg-white/5 border-white/20 hover:bg-white/10 text-white">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Portfolio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column: Bio & Video */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                  {t('about')}
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                    {tutor.bio || t('no_bio')}
                  </p>
                </div>
              </div>

              {tutor.videoIntroduction && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-indigo-600 rounded-full" />
                    {t('video_intro')}
                  </h2>
                  <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black border border-slate-200">
                    <iframe
                      src={tutor.videoIntroduction}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar info/Socials? */}
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                <h3 className="font-bold text-lg text-slate-900">Connect with {tutor.fullName.split(' ')[0]}</h3>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start rounded-xl h-12">
                    <Globe className="w-4 h-4 mr-3 text-slate-400" />
                    Personal Website
                  </Button>
                  <Button variant="outline" className="w-full justify-start rounded-xl h-12">
                    <PlayCircle className="w-4 h-4 mr-3 text-red-500" />
                    YouTube Channel
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Courses Section */}
          <div className="mt-20 space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-emerald-600 rounded-full" />
                {t('courses')}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {tutor.courses.map((course) => (
                <CourseCard key={course.id} href={`/courses/${course.id}`}>
                  <CourseCard.Thumbnail 
                    src={course.thumbnailUrl || ''} 
                    alt={course.title}
                  />
                  <CourseCard.Content>
                    <CourseCard.Title>{course.title}</CourseCard.Title>
                    <CourseCard.Footer>
                      <CourseCard.Rating value={course.averageRating} count={course.reviewCount} />
                      <CourseCard.Price value={course.price} />
                    </CourseCard.Footer>
                  </CourseCard.Content>
                </CourseCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
