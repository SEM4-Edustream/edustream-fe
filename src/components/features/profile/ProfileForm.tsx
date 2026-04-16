import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfile } from "@/services/profileService";

interface ProfileFormProps {
  user: UserProfile;
  isSaving: boolean;
  onChange: (field: keyof UserProfile, value: string) => void;
  onSave: () => void;
}

export function ProfileForm({ user, isSaving, onChange, onSave }: ProfileFormProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
        <p className="text-sm text-slate-500 mt-1">Update your basic profile details.</p>
      </div>
      
      <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={user.name} 
            onChange={(e) => onChange("name", e.target.value)} 
            className="h-11 border-slate-300 focus:border-[#754FFE] focus:ring-[#754FFE] max-w-md" 
            placeholder="Enter your full name" 
          />
        </div>
        
        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="bio" className="text-slate-700 font-medium">Bio</Label>
          <textarea 
            id="bio" 
            name="bio" 
            rows={4} 
            value={user.bio} 
            onChange={(e) => onChange("bio", e.target.value)} 
            placeholder="Tell us about yourself"
            className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#754FFE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end">
        <Button 
          onClick={onSave} 
          disabled={isSaving}
          className="bg-[#754FFE] hover:bg-[#6340db] text-white px-6 w-full sm:w-auto flex items-center justify-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>

    </div>
  );
}
