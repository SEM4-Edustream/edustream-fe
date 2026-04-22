import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { profileService, UserProfile } from "@/services/profileService";
import { useAuth } from "@/context/AuthContext";

export function useProfile() {
  const router = useRouter();
  const { updateUser } = useAuth();
  
  const [user, setUser] = useState<UserProfile>({
    id: "",
    fullName: "",
    username: "",
    headline: "",
    bio: "",
    avatarUrl: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const data = await profileService.getProfile();
      if (data) {
        setUser(data);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load profile. Please log in.");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [router]);

  const updateField = (field: keyof UserProfile, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await profileService.updateProfile({
        fullName: user.fullName,
        headline: user.headline,
        bio: user.bio
      });
      toast.success("Profile updated successfully");
      // Update global context for Navbar sync
      updateUser({ fullName: user.fullName });
      // Refetch to ensure UI is in sync with backend
      await fetchProfile();
    } catch (error) {
        console.error(error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    setIsUploading(true);
    try {
      const newUrl = await profileService.updateAvatar(file);
      setUser((prev) => ({ ...prev, avatarUrl: newUrl }));
      // Update global context for Navbar sync
      updateUser({ avatarUrl: newUrl });
      toast.success("Avatar updated successfully");
    } catch (error) {
        console.error(error);
      toast.error("Failed to update avatar");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    user,
    isLoading,
    isSaving,
    isUploading,
    actions: {
      updateField,
      saveProfile,
      uploadAvatar,
    },
  };
}
