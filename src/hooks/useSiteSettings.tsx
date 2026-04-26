import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import profileFallback from "@/assets/profile-photo.jpg";

export interface SiteSettings {
  profile_photo_url: string | null;
  resume_url: string | null;
  resume_filename: string | null;
}

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<SiteSettings>({
    profile_photo_url: null,
    resume_url: null,
    resume_filename: null,
  });
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("site_settings")
      .select("profile_photo_url, resume_url, resume_filename")
      .maybeSingle();
    if (data) setSettings(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const channel = supabase
      .channel("site_settings_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "site_settings" },
        () => refresh()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  return {
    loading,
    refresh,
    profilePhotoUrl: settings.profile_photo_url || profileFallback,
    resumeUrl: settings.resume_url,
    resumeFilename: settings.resume_filename || "Resume.pdf",
  };
};
