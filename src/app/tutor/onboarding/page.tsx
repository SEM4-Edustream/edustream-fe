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
import fileService from "@/services/fileService";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Loader2, FileCheck, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { id: 1, title: "Basic Info", icon: User },
  { id: 2, title: "Credentials", icon: Upload },
  { id: 3, title: "Review", icon: FileText },
];

export default function TutorOnboardingPage() {
  const { tutorStatus, isLoading, refreshTutorStatus } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileName, setFileName] = useState("");

  // Redirect if already pending
  React.useEffect(() => {
    if (!isLoading && tutorStatus === "PENDING") {
      router.push("/tutor/application");
    }
  }, [tutorStatus, isLoading, router]);
  const [formData, setFormData] = useState({
    headline: "",
    bio: "",
    videoIntroduction: "",
    documentType: "ID_CARD" as const,
    documentUrl: "", 
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (5MB as mentioned in UI)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Max size is 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadSuccess(false);
      setFileName(file.name);
      
      // 1. Get presigned URL
      const { uploadUrl, fileUrl } = await fileService.getPresignedUrl(file.name, file.type, "DOCUMENT");
      
      // 2. Upload to S3
      await fileService.uploadFileToS3(uploadUrl, file);
      
      // 3. Update form state
      setFormData(prev => ({ ...prev, documentUrl: fileUrl }));
      setUploadSuccess(true);
      toast.success("File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.documentUrl) {
      toast.error("Please upload your credentials before submitting.");
      return;
    }
    
    try {
      const loadingToast = toast.loading("Submitting your application...");
      
      // Step 1: Create Profile
      await tutorService.createProfile({
        headline: formData.headline,
        bio: formData.bio,
        videoIntroduction: formData.videoIntroduction,
      });

      // Step 2: Add Document
      await tutorService.addDocument({
        type: formData.documentType,
        fileUrl: formData.documentUrl,
      });

      // Step 3: Trigger Verification
      await tutorService.submitForVerification();
      
      // Update global context state
      await refreshTutorStatus();

      toast.success("Application submitted successfully!", { id: loadingToast });
      router.push("/tutor/application");
    } catch (error) {
      toast.error("Failed to submit application. Please check your details.");
      console.error(error);
    }
  };

  return (
    <div className="bg-slate-50 flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-32 pb-12 px-4">
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
                      <Label>Professional Headline</Label>
                      <Input 
                        placeholder="e.g. Senior Web Developer with 10 years of experience" 
                        className="rounded-xl h-12"
                        value={formData.headline}
                        onChange={(e) => setFormData({...formData, headline: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Bio / Introduction</Label>
                      <Textarea 
                        placeholder="Tell students about your background and teaching philosophy..." 
                        className="min-h-[120px] rounded-xl"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Video Introduction Link (Optional)</Label>
                      <Input 
                        placeholder="https://youtube.com/..." 
                        className="rounded-xl h-12"
                        value={formData.videoIntroduction}
                        onChange={(e) => setFormData({...formData, videoIntroduction: e.target.value})}
                      />
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
                    <p className="text-slate-500">We verify all tutors to maintain platform quality.</p>
                  </div>

                  <div className="space-y-4">
                    <Label>Select Document Type</Label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {["ID_CARD", "DEGREE", "CERTIFICATE"].map((type) => (
                        <button
                          key={type}
                          onClick={() => setFormData({...formData, documentType: type as any})}
                          className={`px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                            formData.documentType === type 
                              ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                              : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300"
                          }`}
                        >
                          {type.replace("_", " ")}
                        </button>
                      ))}
                    </div>

                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />

                    <div 
                      onClick={() => !isUploading && fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-12 text-center group transition-all cursor-pointer relative overflow-hidden ${
                        isUploading ? "border-slate-100 bg-slate-50 cursor-wait" : 
                        uploadSuccess ? "border-emerald-200 bg-emerald-50/30" : 
                        "border-slate-200 hover:border-indigo-400 bg-slate-50/50"
                      }`}
                    >
                      {isUploading ? (
                        <div className="space-y-4">
                          <Loader2 className="w-12 h-12 text-indigo-600 mx-auto animate-spin" />
                          <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 text-lg">Uploading...</h3>
                            <p className="text-slate-500 text-sm">{fileName}</p>
                          </div>
                        </div>
                      ) : uploadSuccess ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
                            <FileCheck className="w-8 h-8 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 text-lg">Upload Success!</h3>
                            <p className="text-emerald-600 text-sm font-medium">{fileName}</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); setUploadSuccess(false); setFormData({...formData, documentUrl: ""}); }}
                            className="mt-4 text-xs font-bold text-slate-400 hover:text-red-500 underline"
                          >
                            Replace file
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4 group-hover:text-indigo-600 transition-colors" />
                          <h3 className="font-bold text-slate-900 text-lg">Click to upload documents</h3>
                          <p className="text-slate-500 text-sm mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                        </>
                      )}
                    </div>
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
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Headline:</span>
                      <span className="font-bold text-slate-900">{formData.headline}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Bio:</span>
                      <p className="text-slate-700 text-sm line-clamp-3">{formData.bio}</p>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest leading-none mb-1">Document Uploaded</span>
                        <span className="text-xs font-bold text-slate-900 leading-none">{fileName || "Your Credential"}</span>
                      </div>
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
      </main>
      <Footer />
    </div>
  );
}
