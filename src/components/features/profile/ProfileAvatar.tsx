import React, { useRef } from "react";
import { Camera, Loader2, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfile } from "@/services/profileService";

interface ProfileAvatarProps {
  user: UserProfile;
  isUploading: boolean;
  onUpload: (file: File) => void;
}

export function ProfileAvatar({ user, isUploading, onUpload }: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    onUpload(e.target.files[0]);
  };

  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const joinDate = user.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
    : "Recently";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Avatar Area */}
        <div 
          className={`relative group ${isUploading ? "cursor-wait" : "cursor-pointer"}`} 
          onClick={handleAvatarClick}
        >
          <Avatar className="w-24 h-24 border-4 border-white shadow-md">
            <AvatarImage src={user.avatarUrl || ""} className="object-cover" />
            <AvatarFallback className="text-xl bg-blue-100 text-blue-600 font-bold">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
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

        {/* User Info Area */}
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-slate-900">{user.fullName || "User"}</h2>
          <p className="text-slate-500 mt-1 flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined {joinDate}</span>
          </p>
        </div>

        {/* Stats Area */}
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
  );
}
