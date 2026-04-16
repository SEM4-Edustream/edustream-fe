"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { ProfileAvatar } from "@/components/features/profile/ProfileAvatar";
import { ProfileForm } from "@/components/features/profile/ProfileForm";
import { ProfileLayout } from "@/components/features/profile/ProfileLayout";

export default function ProfilePage() {
  // Business logic fully managed by the Custom Hook
  const { user, isLoading, isSaving, isUploading, actions } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#754FFE]" />
      </div>
    );
  }

  // Component Assembly Strategy
  return (
    <ProfileLayout>
      <ProfileAvatar 
        user={user} 
        isUploading={isUploading} 
        onUpload={actions.uploadAvatar} 
      />
      
      <ProfileForm 
        user={user} 
        isSaving={isSaving} 
        onChange={actions.updateField} 
        onSave={actions.saveProfile} 
      />
    </ProfileLayout>
  );
}
