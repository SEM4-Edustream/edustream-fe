"use client";

import React from 'react';
import { Clock, CheckCircle2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'next-view-transitions';

export default function TutorApplicationStatusPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12 text-center relative overflow-hidden">
          
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 blur-2xl" />

          <div className="relative z-10">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse text-amber-500">
               <Clock className="w-10 h-10" />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              Application Under Review
            </h1>
            
            <p className="text-slate-700 text-lg mb-10 leading-relaxed font-medium">
              We've received your tutor application! Our team is currently verifying your credentials. This usually takes <span className="text-indigo-600 font-bold">2-3 business days</span>.
            </p>

            <div className="space-y-4 mb-10">
              <StatusCard 
                icon={<Mail className="w-5 h-5 text-indigo-500" />}
                title="Email Confirmation"
                description="We've sent a copy of your application to your inbox."
                status="Completed"
              />
              <StatusCard 
                icon={<ShieldCheck className="w-5 h-5 text-amber-500" />}
                title="Identity Verification"
                description="Checking your provided documents for authenticity."
                status="In Progress"
              />
              <StatusCard 
                icon={<Clock className="w-5 h-5 text-slate-300" />}
                title="Final Approval"
                description="Final review by our community management team."
                status="Pending"
              />
            </div>

            <div className="flex flex-col gap-4">
                <Link href="/profile">
                  <Button className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-lg">
                     Go to My Profile
                  </Button>
                </Link>
                <Link href="/help">
                  <Button variant="ghost" className="w-full text-slate-600 font-semibold hover:text-indigo-600">
                     Need help? Contact support
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ icon, title, description, status }: { icon: React.ReactNode, title: string, description: string, status: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 text-left">
       <div className="mt-1">{icon}</div>
       <div className="flex-1">
          <h4 className="font-bold text-slate-900 text-sm">{title}</h4>
          <p className="text-slate-500 text-xs mt-0.5">{description}</p>
       </div>
       <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
         status === "Completed" ? "bg-emerald-100 text-emerald-700" :
         status === "In Progress" ? "bg-amber-100 text-amber-700 animate-pulse" :
         "bg-slate-100 text-slate-500"
       }`}>
          {status}
       </div>
    </div>
  );
}
