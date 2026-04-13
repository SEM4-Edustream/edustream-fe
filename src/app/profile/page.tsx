"use client";

import React, { useState, useEffect, useRef } from "react";
import { UserCircle, Camera, Settings, Shield, Bell, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState({
    id: "",
    name: "",
    bio: "",
    avatarUrl: "",
    createdAt: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/api/profile/me");
        setUser(prev => ({
          ...prev,
          id: data.id || "",
          name: data.fullName || "",
          bio: data.bio || "",
          avatarUrl: data.avatarUrl || "",
          createdAt: data.createdAt || "",
        }));
      } catch (error) {
        toast.error("Failed to load profile. Please log in.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put("/api/profile/me", {
        fullName: user.name,
        bio: user.bio,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await api.put("/api/profile/me/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser({ ...user, avatarUrl: data.avatar_url || data.avatarUrl });
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#754FFE]" />
      </div>
    );
  }

  const joinDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Recently";

  return (
    <div className="min-h-screen bg-slate-50/50 py-10 px-4 sm:px-6 font-[sans-serif]">
      <div className="container mx-auto max-w-[1140px]">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 mt-2">Manage your profile information and preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-3">
            <nav className="flex flex-col gap-2">
              <a href="#profile" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 rounded-lg font-medium transition-colors">
                <UserCircle className="w-5 h-5" />
                Public Profile
              </a>
              <a href="#account" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                <Settings className="w-5 h-5" />
                Account Settings
              </a>
              <a href="#security" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                <Shield className="w-5 h-5" />
                Security
              </a>
              <a href="#notifications" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">
                <Bell className="w-5 h-5" />
                Notifications
              </a>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* Profile Avatar Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div 
                  className={`relative group ${isUploading ? "cursor-wait" : "cursor-pointer"}`} 
                  onClick={handleAvatarClick}
                >
                  <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                    <AvatarImage src={user.avatarUrl || ""} className="object-cover" />
                    <AvatarFallback className="text-xl bg-blue-100 text-blue-600 font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-0 right-0 p-2 bg-[#754FFE] hover:bg-[#6340db] text-white rounded-full shadow-lg transition-colors border-2 border-white">
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleAvatarChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-slate-900">{user.name || "User"}</h2>
                  <p className="text-slate-500 mt-1 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
                     <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {joinDate}</span>
                  </p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto mt-4 sm:mt-0 justify-center">
                  <div className="bg-orange-50 px-4 py-3 rounded-lg text-center w-24">
                    <div className="font-bold text-orange-600 text-xl">0</div>
                    <div className="text-[10px] text-orange-600/80 font-bold uppercase tracking-wider">Courses</div>
                  </div>
                  <div className="bg-emerald-50 px-4 py-3 rounded-lg text-center w-24">
                    <div className="font-bold text-emerald-600 text-xl">0</div>
                    <div className="text-[10px] text-emerald-600/80 font-bold uppercase tracking-wider">Certs</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Info Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h3 className="text-lg font-bold text-slate-900">Personal Information</h3>
                <p className="text-sm text-slate-500 mt-1">Update your basic profile details.</p>
              </div>
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label htmlFor="name" className="text-slate-700 font-medium">Full Name</Label>
                  <Input id="name" name="name" value={user.name} onChange={handleInputChange} className="h-11 border-slate-300 focus:border-[#754FFE] focus:ring-[#754FFE] max-w-md" placeholder="Enter your full name" />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label htmlFor="bio" className="text-slate-700 font-medium">Bio</Label>
                  <textarea 
                    id="bio" 
                    name="bio" 
                    rows={4} 
                    value={user.bio} 
                    onChange={handleInputChange} 
                    placeholder="Tell us about yourself"
                    className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#754FFE] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="p-6 bg-slate-50 border-t border-slate-200 rounded-b-xl flex justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="bg-[#754FFE] hover:bg-[#6340db] text-white px-6 w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
