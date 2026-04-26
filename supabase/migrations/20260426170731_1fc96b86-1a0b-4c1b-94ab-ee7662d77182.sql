-- 1. Roles enum + user_roles table (separate from profiles to prevent privilege escalation)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Bootstrap: first signed-up user becomes admin automatically
CREATE OR REPLACE FUNCTION public.assign_first_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_first_admin();

-- 2. Shared updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 3. Site settings (single-row key/value-ish for resume + photo)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  profile_photo_url TEXT,
  resume_url TEXT,
  resume_filename TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view site settings"
  ON public.site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert site settings"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update site settings"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (singleton) VALUES (true);

-- 4. Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tech TEXT[] NOT NULL DEFAULT '{}',
  demo_url TEXT,
  code_url TEXT,
  thumbnail_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_projects_display_order ON public.projects (display_order);

-- 5. Seed projects (the four currently hard-coded)
INSERT INTO public.projects (title, description, tech, demo_url, code_url, display_order) VALUES
  ('Smart Greenhouse Monitoring System',
   'Real-time greenhouse dashboard with live sensor streaming via Supabase WebSockets (<2s latency), an interactive 3D digital twin built with Three.js & React Three Fiber, and Google Gemini AI for plant disease detection from leaf images. Google OAuth, protected routes, deployed on Vercel with 99.8% uptime.',
   ARRAY['React.js','Tailwind','Three.js','Supabase','Gemini AI','Vercel'],
   '#', 'https://github.com/aman73yadav', 1),
  ('Personal Portfolio Website',
   'My original developer portfolio showcasing skills, education, certifications and projects with a clean, responsive layout hosted on GitHub Pages.',
   ARRAY['HTML','CSS','JavaScript','Bootstrap'],
   'https://aman73yadav.github.io/Its_me-Profile/', 'https://github.com/aman73yadav/Its_me-Profile', 2),
  ('Web Application using Maven',
   'Java web application built with Maven covering REST controllers, service & DAO layers, and full JUnit test coverage for DTOs, services and controllers. Hands-on software analysis, programming, testing and debugging.',
   ARRAY['Java','Spring Boot','Maven','REST','JUnit','Hibernate'],
   '#', 'https://github.com/aman73yadav', 3),
  ('Java Full Stack Mini Projects',
   'Collection of full stack exercises from JSpiders Bangalore training: CRUD apps with Spring MVC + Hibernate + MySQL backends and React/JSP frontends.',
   ARRAY['Java','Spring MVC','Hibernate','MySQL','JSP'],
   '#', 'https://github.com/aman73yadav', 4);

-- 6. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('resumes', 'resumes', true),
  ('profile-photos', 'profile-photos', true),
  ('project-thumbnails', 'project-thumbnails', true);

-- Public read for all three buckets
CREATE POLICY "Public read resumes"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes');

CREATE POLICY "Public read profile photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-photos');

CREATE POLICY "Public read project thumbnails"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-thumbnails');

-- Admin-only write/update/delete for each bucket
CREATE POLICY "Admins manage resumes"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'resumes' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage profile photos"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'profile-photos' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'profile-photos' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage project thumbnails"
  ON storage.objects FOR ALL
  TO authenticated
  USING (bucket_id = 'project-thumbnails' AND public.has_role(auth.uid(), 'admin'))
  WITH CHECK (bucket_id = 'project-thumbnails' AND public.has_role(auth.uid(), 'admin'));