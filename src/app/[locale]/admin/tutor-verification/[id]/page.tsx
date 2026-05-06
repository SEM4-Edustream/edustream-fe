"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import adminService from '@/services/adminService';
import { TutorProfileResponse } from '@/services/tutorService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Video, 
  User as UserIcon,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Calendar,
  History,
  Activity,
  Award,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function AdminTutorDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<TutorProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewComment, setReviewComment] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        const data = await adminService.getTutorDetail(id as string);
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch tutor details", error);
        toast.error("Could not load application details.");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleReview = async (action: 'APPROVED' | 'REJECTED') => {
    if (action === 'REJECTED' && !reviewComment.trim()) {
      toast.error("Please provide a reason for rejection.");
      return;
    }

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading(`${action === 'APPROVED' ? 'Approving' : 'Rejecting'} application...`);
      
      await adminService.reviewTutor(id as string, {
        action,
        reviewComment
      });

      toast.success(`Application ${action.toLowerCase()} successfully!`, { id: loadingToast });
      router.push('/admin/tutor-verification');
    } catch (error) {
      toast.error("Failed to process review.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold">Loading application details...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100 shadow-xl">
         <XCircle className="w-16 h-16 text-red-100 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Profile Not Found</h2>
          <p className="text-slate-600 mb-8 font-medium">This application might have been deleted or moved.</p>
          <Link href="/admin/tutor-verification">
             <Button className="bg-slate-900 rounded-xl px-10 font-semibold">Go Back</Button>
          </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/tutor-verification">
            <Button variant="ghost" size="icon" className="group rounded-2xl h-12 w-12 bg-white border border-slate-200 shadow-sm transition-all hover:bg-slate-900 hover:text-white">
               <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
                {profile.status === 'PENDING' ? 'Review Application' : 'Tutor Application Insight'}
              </h1>
              <Badge className={cn(
                "border-none font-bold text-xs px-3 py-1.5 rounded-lg uppercase tracking-widest",
                profile.status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                profile.status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                "bg-red-100 text-red-700"
              )}>
                {profile.status}
              </Badge>
            </div>
            <p className="text-slate-600 font-medium">
              {profile.status === 'PENDING' ? 'Evaluate the applicant credentials and expertise.' : 'Complete history of the tutor verification process.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Profile Section */}
          <div className="bg-white rounded-[32px] p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50/50 rounded-bl-[100px] -mr-10 -mt-10 -z-0" />
             
             <div className="relative z-10">
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                    <div className="w-20 h-20 rounded-[28px] bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-200 uppercase">
                       {profile.tutorName?.substring(0,2) || 'TP'}
                    </div>
                    <div className="space-y-1">
                       <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{profile.tutorName || "Tutor Applicant"}</h2>
                       <p className="text-indigo-600 font-semibold">{profile.headline}</p>
                       <div className="flex items-center gap-4 text-slate-500 font-bold text-sm mt-2">
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-lg border border-slate-100">
                             <Calendar className="w-4 h-4 text-slate-400" />
                             <span>Submitted: {profile.verificationStartDate ? format(new Date(profile.verificationStartDate), 'MMM dd, yyyy') : 'N/A'}</span>
                          </div>
                          {profile.status !== 'PENDING' && profile.verifiedAt && (
                            <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                               <CheckCircle2 className="w-4 h-4" />
                               <span>Verified: {format(new Date(profile.verifiedAt), 'MMM dd, yyyy')}</span>
                            </div>
                          )}
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                   <div className="space-y-6">
                       <div className="space-y-2">
                        <Label className="text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Headline</Label>
                        <p className="text-lg font-semibold text-slate-800 leading-snug">{profile.headline}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-slate-500 font-semibold uppercase text-[11px] tracking-widest">Biography</Label>
                        <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">{profile.bio}</p>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-slate-400 font-black uppercase text-[11px] tracking-widest">Intro Video</Label>
                        {profile.videoIntroduction ? (
                         <div className="group relative aspect-video rounded-3xl bg-slate-900 overflow-hidden shadow-lg border-4 border-slate-100">
                           <div className="absolute inset-0 flex items-center justify-center z-10">
                             <Button variant="secondary" className="rounded-full h-14 w-14 p-0 shadow-2xl transition-transform group-hover:scale-110">
                                <Video className="w-6 h-6 text-indigo-600" />
                             </Button>
                           </div>
                           <div className="absolute bottom-4 left-4 right-4 z-10">
                              <p className="text-[10px] text-white/50 font-black uppercase tracking-widest truncate">{profile.videoIntroduction}</p>
                           </div>
                           <div className="absolute inset-0 bg-black/40" />
                         </div>
                        ) : (
                          <div className="aspect-video rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
                             <Video className="w-10 h-10 mb-2 opacity-20" />
                             <p className="font-bold text-sm">No video provided</p>
                          </div>
                        )}
                      </div>
                   </div>
                </div>
             </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <FileText className="w-7 h-7 text-indigo-600" />
              Verified Credentials
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {profile.documents && profile.documents.length > 0 ? (
                 profile.documents.map((doc) => (
                    <div key={doc.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 flex items-center justify-between group hover:border-indigo-200 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                             <FileText className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">{doc.documentType?.replace('_', ' ') || "DOCUMENT"}</p>
                             <p className="text-xs text-slate-500 font-bold mt-0.5">Verification Document</p>
                          </div>
                       </div>
                       <a href={doc.documentUrl} target="_blank" rel="noopener noreferrer">
                          <Button variant="ghost" size="icon" className="rounded-xl h-12 w-12 hover:bg-indigo-50 text-indigo-600 transition-colors">
                             <ExternalLink className="w-5 h-5" />
                          </Button>
                       </a>
                    </div>
                 ))
               ) : (
                 <div className="col-span-2 py-10 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
                    <p className="font-bold">No documents uploaded.</p>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6 relative">
           <div className="sticky top-28 space-y-6">
             {profile.status === 'PENDING' ? (
                <>
                  <div className="bg-[#1c1d1f] text-white rounded-[32px] p-8 shadow-2xl shadow-indigo-200/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[80px] -mr-10 -mt-10" />
                    
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-6 tracking-tight flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        Review Decision
                      </h3>
                      
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-slate-400 font-semibold uppercase text-[10px] tracking-widest">Admin Feedback</Label>
                          <Textarea 
                            placeholder="Provide reasons for approval or rejection..."
                            className="bg-white/5 border-white/10 rounded-2xl min-h-[140px] text-white placeholder:text-slate-600 focus:bg-white/10 focus:ring-indigo-500 transition-all text-sm font-medium leading-relaxed"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                          />
                        </div>

                        <div className="flex flex-col gap-3">
                           <Button 
                            disabled={isSubmitting}
                            onClick={() => handleReview('APPROVED')}
                            className="w-full h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-semibold text-sm uppercase tracking-widest gap-3 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                           >
                             {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                             Approve Application
                           </Button>

                           <Button 
                            variant="ghost"
                            disabled={isSubmitting}
                            onClick={() => handleReview('REJECTED')}
                            className="w-full h-14 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-2xl font-semibold text-sm uppercase tracking-widest gap-3 transition-all border border-white/5"
                           >
                             {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                             Reject Application
                           </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl">
                    <h4 className="font-black text-slate-900 mb-4 text-sm uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-indigo-600" />
                      Review Guidelines
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                          Verify identity document matches applicant name.
                      </li>
                      <li className="flex items-start gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                          Check if biography demonstrates professional expertise.
                      </li>
                      <li className="flex items-start gap-3 text-xs font-medium text-slate-500 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                          Ensure intro video quality meets platform standards.
                      </li>
                    </ul>
                  </div>
                </>
             ) : (
                <div className="space-y-6">
                  <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl relative overflow-hidden">
                    <div className={cn(
                      "absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10",
                      profile.status === 'APPROVED' ? "bg-emerald-500" : "bg-red-500"
                    )} />
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 mb-8">
                       <History className="w-5 h-5 text-indigo-600" />
                       Process Summary
                    </h3>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Final Status</span>
                          <Badge className={cn(
                             "font-black text-[10px] uppercase tracking-widest px-3 py-1",
                             profile.status === 'APPROVED' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          )}>
                             {profile.status}
                          </Badge>
                       </div>

                       <div className="space-y-4">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Activity className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Application Start</p>
                                <p className="text-sm font-bold text-slate-900">{profile.verificationStartDate ? format(new Date(profile.verificationStartDate), 'MMM dd, yyyy HH:mm') : 'N/A'}</p>
                             </div>
                          </div>

                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <CheckCircle2 className="w-5 h-5" />
                             </div>
                             <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Decision Made</p>
                                <p className="text-sm font-bold text-slate-900">{profile.verifiedAt ? format(new Date(profile.verifiedAt), 'MMM dd, yyyy HH:mm') : 'Recently'}</p>
                             </div>
                          </div>
                       </div>

                       <div className="pt-6 border-t border-slate-100">
                          <div className="flex items-center gap-2 text-indigo-600 mb-2">
                             <Info className="w-4 h-4" />
                             <span className="text-[10px] font-black uppercase tracking-widest">Administrator Note</span>
                          </div>
                          <p className="text-xs font-medium text-slate-500 leading-relaxed italic">
                             Audit record finalized by system integrity module. No further actions required.
                          </p>
                       </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-600 text-white rounded-[32px] p-8 shadow-xl shadow-indigo-100">
                     <div className="flex items-center gap-3 mb-4">
                        <Award className="w-6 h-6 text-indigo-200" />
                        <h4 className="font-bold text-lg">Next Steps</h4>
                     </div>
                     <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                        {profile.status === 'APPROVED' 
                          ? 'This tutor is now active and can create/publish courses. Monitor their performance in the Monthly Stats panel.'
                          : 'Applicant can revise their application and re-submit after addressing the issues. Recommend checking specific document authenticity.'}
                     </p>
                  </div>
                </div>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
