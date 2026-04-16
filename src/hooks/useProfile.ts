import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { profileService, UserProfile } from "@/services/profileService";

export function useProfile() {
  const router = useRouter();
  
  const [user, setUser] = useState<UserProfile>({
    id: "",
    name: "",
    bio: "",
    avatarUrl: "",
    createdAt: "",
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await profileService.getProfile();
        setUser(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load profile. Please log in.");
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const updateField = (field: keyof UserProfile, value: string) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      await profileService.updateProfile(user.name, user.bio);
      toast.success("Profile updated successfully");
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
