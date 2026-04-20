"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, User, FileText, Upload, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import tutorService from "@/services/tutorService";
import { useRouter } from "next/navigation";

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Credentials", icon: Upload },
  { id: 3, title: "Review", icon: FileText },
];

export default function TutorOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const [formData, setFormData] = useState({
    bio: "",
    specialization: "",
    experienceYears: 0,
    documentType: "ID_CARD" as const,
    documentUrl: "https://example.com/mock-id.pdf", // Mocked for now
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      const loadingToast = toast.loading("Submitting your application...");
      
      // Step 1: Create Profile
      await tutorService.createProfile({
        bio: formData.bio,
        specialization: formData.specialization,
        experienceYears: Number(formData.experienceYears),
      });

      // Step 2: Add Document
      await tutorService.addDocument({
        documentType: formData.documentType,
        documentUrl: formData.documentUrl,
      });

      // Step 3: Trigger Verification
      await tutorService.submitForVerification();

      toast.success("Application submitted successfully!", { id: loadingToast });
      router.push("/tutor/application");
    } catch (error) {
      toast.error("Failed to submit application. Please check your details.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        
        {/* Progress Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
           <div className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <div className="flex flex-col items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentStep >= step.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      {currentStep > step.id ? <Check className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      currentStep >= step.id ? "text-slate-900" : "text-slate-400"
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`h-0.5 flex-1 mx-4 ${currentStep > step.id ? "bg-indigo-600" : "bg-slate-100"}`} />
                  )}
                </React.Fragment>
              ))}
           </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900">Tell us about yourself</h2>
                  <p className="text-slate-500">Share your expertise and teaching philosophy.</p>
                </div>

                <div className="space-y-4">
                   <div className="space-y-2">
                     <Label>Bio / Introduction</Label>
                     <Textarea 
                       placeholder="Tell students about your background..." 
                       className="min-h-[120px] rounded-xl"
                       value={formData.bio}
                       onChange={(e) => setFormData({...formData, bio: e.target.value})}
                     />
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Area of Specialization</Label>
                        <Input 
                          placeholder="e.g. Web Development" 
                          className="rounded-xl"
                          value={formData.specialization}
                          onChange={(e) => setFormData({...formData, specialization: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Years of Experience</Label>
                        <Input 
                          type="number" 
                          className="rounded-xl"
                          value={formData.experienceYears}
                          onChange={(e) => setFormData({...formData, experienceYears: Number(e.target.value)})}
                        />
                      </div>
                   </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="space-y-2">
                  <h2 className="text-3xl font-bold text-slate-900">Upload Credentials</h2>
                  <p className="text-slate-500">We verify all instructors to maintain platform quality.</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center group hover:border-indigo-400 transition-colors cursor-pointer bg-slate-50/50">
                   <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-indigo-600 transition-colors" />
                   <h3 className="font-bold text-slate-900 text-lg">Click to upload documents</h3>
                   <p className="text-slate-500 text-sm mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                 <div className="space-y-2 text-center">
                   <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-10 h-10 text-indigo-600" />
                   </div>
                   <h2 className="text-3xl font-bold text-slate-900">Ready to submit!</h2>
                   <p className="text-slate-500">Please review your information before submitting for verification.</p>
                 </div>

                 <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Specialization:</span>
                       <span className="font-bold text-slate-900">{formData.specialization}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500">Experience:</span>
                       <span className="font-bold text-slate-900">{formData.experienceYears} years</span>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100">
             <Button 
               variant="ghost" 
               onClick={prevStep} 
               disabled={currentStep === 1}
               className="rounded-xl font-bold"
             >
               <ChevronLeft className="w-4 h-4 mr-2" />
               Back
             </Button>

             {currentStep < steps.length ? (
               <Button 
                 onClick={nextStep} 
                 className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 font-bold"
               >
                 Next
                 <ChevronRight className="w-4 h-4 ml-2" />
               </Button>
             ) : (
               <Button 
                 onClick={handleSubmit} 
                 className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 font-bold shadow-lg shadow-emerald-200 animate-pulse"
               >
                  Submit Application
               </Button>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}
