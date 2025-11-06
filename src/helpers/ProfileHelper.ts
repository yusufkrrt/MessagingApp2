import { supabase } from "../lib/supabase";
import { decode } from "base64-arraybuffer";

export interface ProfileData {
  id?: string;          
  firstName: string;    
  lastName: string;    
  phone: string;        
  username?: string;    
  bio?: string;         
  avatarUrl?: string;    
  createdAt?: string;   
}

export const fetchOrCreateProfile = async (): Promise<ProfileData> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Kullanıcı oturumu bulunamadı");
  }
  const userId = userData.user.id;
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    console.error("Profil çekme hatası:", error);
    throw new Error("Profil yüklenirken bir hata oluştu");
  }
  if (data) {
    return {
      id: data.id,
      firstName: data.first_name || "",
      lastName: data.last_name || "",
      phone: data.phone || "",
      username: data.username || "",
      bio: data.bio || "",
      avatarUrl: data.avatar_url || "",
      createdAt: data.created_at || "",
    };
  }
  return {
    firstName: "",
    lastName: "",
    phone: "",
    username: "",
    bio: "",
    avatarUrl: "",
  };
};

export const updateProfile = async (profile: ProfileData): Promise<boolean> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Kullanıcı oturumu bulunamadı");
  }
  const userId = userData.user.id;
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  const profileData = {
    first_name: profile.firstName.trim(),
    last_name: profile.lastName.trim(),
    phone: profile.phone.trim(),
    username: profile.username?.trim() || null,
    bio: profile.bio?.trim() || null,
    avatar_url: profile.avatarUrl || null,
  };
  if (existingProfile) {
    const { error } = await supabase
      .from("profiles")
      .update(profileData)
      .eq("id", userId);
    if (error) {
      console.error("Güncelleme hatası:", error);
      throw new Error(`Güncelleme hatası: ${error.message}`);
    }
  } else {
    const { error } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        ...profileData,
      });
    if (error) {
      console.error("Oluşturma hatası:", error);
      throw new Error(`Oluşturma hatası: ${error.message}`);
    }
  }
  return true;
};

export const uploadAvatar = async (input: string): Promise<string> => {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Kullanıcı oturumu bulunamadı");
  }
  const userId = userData.user.id;
  try {
    let fileData;
    let ext = "jpeg";
    let mime = "image/jpeg";
    if (input.includes("base64,")) {
      const base64 = input.split("base64,")[1];
      mime = input.split(':')[1].split(';')[0] || "image/jpeg";
      ext = mime.split("/")[1] || "jpeg";
      fileData = decode(base64);
    } else {
      const response = await fetch(input);
      fileData = await response.blob();
      mime = response.headers.get("Content-Type") || "image/jpeg";
      ext = mime.split("/")[1] || "jpeg";
    }
    const { data: oldFiles } = await supabase.storage.from("avatars").list(userId);
    if (oldFiles && oldFiles.length > 0) {
      const filesToDelete = oldFiles.map(file => `${userId}/${file.name}`);
      await supabase.storage.from("avatars").remove(filesToDelete);
    }
    const fileName = `${userId}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(fileName, fileData, { contentType: mime, upsert: true });
    if (error) {
      console.error("Upload hatası:", error);
      throw new Error(`Fotoğraf yüklenirken hata: ${error.message}`);
    }
    const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(fileName);
    return publicUrlData.publicUrl;
  } catch (error: any) {
    console.error("Avatar upload error:", error);
    throw new Error(error.message || "Fotoğraf yüklenirken bir hata oluştu");
  }
};

export const getUserProfile = async (userId: string): Promise<ProfileData> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    console.error("Profil çekme hatası:", error);
    throw new Error("Profil yüklenirken bir hata oluştu");
  }
  return {
    id: data.id,
    firstName: data.first_name || "",
    lastName: data.last_name || "",
    phone: data.phone || "",
    username: data.username || "",
    bio: data.bio || "",
    avatarUrl: data.avatar_url || "",
    createdAt: data.created_at || "",
  };
};

export const searchUserByUsername = async (username: string): Promise<ProfileData[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .ilike("username", `%${username}%`)
    .limit(20);
  if (error) {
    console.error("Arama hatası:", error);
    throw new Error("Kullanıcı arama sırasında hata oluştu");
  }
  return data.map(profile => ({
    id: profile.id,
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    phone: profile.phone || "",
    username: profile.username || "",
    bio: profile.bio || "",
    avatarUrl: profile.avatar_url || "",
    createdAt: profile.created_at || "",
  }));
};

export function getInitials(profile: ProfileData | undefined | null) {
  if (!profile) return "?";
  const { firstName, lastName } = profile;
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "?";
}
