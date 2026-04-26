import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { useProjects, Project } from "@/hooks/useProjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  FileText,
  ImageIcon,
  Plus,
  Trash2,
  Save,
  LogOut,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title required").max(120),
  description: z.string().trim().min(1, "Description required").max(2000),
  tech: z.string().max(500).optional(),
  demo_url: z.string().trim().max(500).optional().or(z.literal("")),
  code_url: z.string().trim().max(500).optional().or(z.literal("")),
});

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAuth();
  const { profilePhotoUrl, resumeUrl, resumeFilename, refresh: refreshSettings } =
    useSiteSettings();
  const { projects, refresh: refreshProjects } = useProjects();

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold mb-3">Access denied</h1>
          <p className="text-muted-foreground mb-6">
            Your account doesn&apos;t have admin permissions.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Home
            </Button>
            <Button onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">
        <header className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Update your resume, photo, and projects.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> View site
            </Button>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </header>

        <ResumeSection
          resumeUrl={resumeUrl}
          resumeFilename={resumeFilename}
          onUpdated={refreshSettings}
        />
        <PhotoSection photoUrl={profilePhotoUrl} onUpdated={refreshSettings} />
        <ProjectsSection projects={projects} onChanged={refreshProjects} />
      </div>
    </main>
  );
};

/* ---------- Resume ---------- */
const ResumeSection = ({
  resumeUrl,
  resumeFilename,
  onUpdated,
}: {
  resumeUrl: string | null;
  resumeFilename: string;
  onUpdated: () => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File must be under 10 MB");
      return;
    }
    setUploading(true);
    try {
      const path = `resume-${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage
        .from("resumes")
        .upload(path, file, { contentType: "application/pdf", upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("resumes").getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from("site_settings")
        .update({ resume_url: pub.publicUrl, resume_filename: file.name })
        .eq("singleton", true);
      if (dbErr) throw dbErr;
      toast.success("Resume updated");
      onUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" /> Resume
      </h2>
      <div className="flex flex-wrap items-center gap-4">
        {resumeUrl ? (
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            <ExternalLink className="h-4 w-4" /> {resumeFilename}
          </a>
        ) : (
          <span className="text-sm text-muted-foreground">No resume uploaded yet</span>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />
        <Button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="ml-auto"
        >
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Replace PDF
        </Button>
      </div>
    </Card>
  );
};

/* ---------- Photo ---------- */
const PhotoSection = ({
  photoUrl,
  onUpdated,
}: {
  photoUrl: string;
  onUpdated: () => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `profile-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("profile-photos")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("profile-photos").getPublicUrl(path);
      const { error: dbErr } = await supabase
        .from("site_settings")
        .update({ profile_photo_url: pub.publicUrl })
        .eq("singleton", true);
      if (dbErr) throw dbErr;
      toast.success("Profile photo updated");
      onUpdated();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <ImageIcon className="h-5 w-5 text-primary" /> Profile Photo
      </h2>
      <div className="flex flex-wrap items-center gap-6">
        <img
          src={photoUrl}
          alt="Current profile"
          className="w-24 h-24 rounded-full object-cover border-2 border-primary/30"
        />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleUpload(f);
          }}
        />
        <Button onClick={() => inputRef.current?.click()} disabled={uploading}>
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          Replace photo
        </Button>
      </div>
    </Card>
  );
};

/* ---------- Projects ---------- */
const ProjectsSection = ({
  projects,
  onChanged,
}: {
  projects: Project[];
  onChanged: () => void;
}) => {
  const [creating, setCreating] = useState(false);

  const handleAdd = async () => {
    setCreating(true);
    try {
      const maxOrder = projects.reduce((m, p) => Math.max(m, p.display_order), 0);
      const { error } = await supabase.from("projects").insert({
        title: "New Project",
        description: "Describe your project here.",
        tech: [],
        display_order: maxOrder + 1,
      });
      if (error) throw error;
      toast.success("Project added");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add project");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Projects ({projects.length})</h2>
        <Button onClick={handleAdd} disabled={creating} size="sm">
          {creating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          Add project
        </Button>
      </div>
      <div className="space-y-4">
        {projects.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No projects yet. Click &ldquo;Add project&rdquo; to get started.
          </p>
        )}
        {projects.map((p) => (
          <ProjectEditor key={p.id} project={p} onChanged={onChanged} />
        ))}
      </div>
    </Card>
  );
};

const ProjectEditor = ({
  project,
  onChanged,
}: {
  project: Project;
  onChanged: () => void;
}) => {
  const [title, setTitle] = useState(project.title);
  const [description, setDescription] = useState(project.description);
  const [tech, setTech] = useState(project.tech.join(", "));
  const [demoUrl, setDemoUrl] = useState(project.demo_url || "");
  const [codeUrl, setCodeUrl] = useState(project.code_url || "");
  const [displayOrder, setDisplayOrder] = useState(project.display_order);
  const [thumbnailUrl, setThumbnailUrl] = useState(project.thumbnail_url);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    const parsed = projectSchema.safeParse({ title, description, tech, demo_url: demoUrl, code_url: codeUrl });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    try {
      const techArr = tech
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .slice(0, 30);
      const { error } = await supabase
        .from("projects")
        .update({
          title: parsed.data.title,
          description: parsed.data.description,
          tech: techArr,
          demo_url: demoUrl.trim() || null,
          code_url: codeUrl.trim() || null,
          display_order: Number(displayOrder) || 0,
          thumbnail_url: thumbnailUrl,
        })
        .eq("id", project.id);
      if (error) throw error;
      toast.success("Saved");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${project.title}"?`)) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from("projects").delete().eq("id", project.id);
      if (error) throw error;
      toast.success("Project deleted");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  const handleThumbnailUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5 MB");
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${project.id}-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("project-thumbnails")
        .upload(path, file, { contentType: file.type, upsert: true });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("project-thumbnails").getPublicUrl(path);
      setThumbnailUrl(pub.publicUrl);
      const { error: dbErr } = await supabase
        .from("projects")
        .update({ thumbnail_url: pub.publicUrl })
        .eq("id", project.id);
      if (dbErr) throw dbErr;
      toast.success("Thumbnail uploaded");
      onChanged();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <Card className="p-5 bg-background border-border">
      <div className="grid md:grid-cols-[120px_1fr] gap-4">
        <div className="space-y-2">
          <div className="aspect-video md:aspect-square w-full rounded-md overflow-hidden bg-muted border border-border flex items-center justify-center">
            {thumbnailUrl ? (
              <img src={thumbnailUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleThumbnailUpload(f);
            }}
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full"
            disabled={uploading}
            onClick={() => fileRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Upload className="h-3 w-3" />
            )}
          </Button>
        </div>

        <div className="space-y-3">
          <div className="grid sm:grid-cols-[1fr_100px] gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Order</label>
              <Input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={2000}
            />
          </div>
          <div>
            <label className="text-xs font-medium mb-1 block">
              Tech stack (comma separated)
            </label>
            <Input
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="React, Tailwind, Node.js"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium mb-1 block">Demo URL</label>
              <Input
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1 block">Code URL</label>
              <Input
                value={codeUrl}
                onChange={(e) => setCodeUrl(e.target.value)}
                placeholder="https://github.com/..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Admin;
