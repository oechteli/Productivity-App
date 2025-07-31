-- =============================================
-- FocusFlow Todo App - Supabase Schema
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- =============================================
-- PROJECTS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-blue-100 text-blue-700',
  allowed_assignees TEXT[] DEFAULT '{}'
);

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own projects" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- AREAS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'bg-green-100 text-green-700'
);

-- Enable RLS
ALTER TABLE areas ENABLE ROW LEVEL SECURITY;

-- RLS Policies for areas
CREATE POLICY "Users can view own areas" ON areas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own areas" ON areas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own areas" ON areas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own areas" ON areas
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- TODOS TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS todos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 1 CHECK (priority >= 1 AND priority <= 4),
  due_date DATE,
  due_time TIME,
  start_date DATE,
  start_time TIME,
  end_date DATE,
  assignees TEXT[],
  area TEXT,
  project TEXT,
  category_id UUID,
  position INTEGER DEFAULT 0
);

-- Enable RLS
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for todos
CREATE POLICY "Users can view own todos" ON todos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos" ON todos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos" ON todos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos" ON todos
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Todos indexes
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_due_date ON todos(due_date);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_position ON todos(position);

-- Projects indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);

-- Areas indexes
CREATE INDEX IF NOT EXISTS idx_areas_user_id ON areas(user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to handle updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_areas_updated_at
  BEFORE UPDATE ON areas
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

CREATE TRIGGER handle_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- Function to create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'name');
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =============================================
-- SAMPLE DATA (Optional - for testing)
-- =============================================

-- Insert sample projects (you can run this after creating a user)
/*
INSERT INTO projects (user_id, name, color, allowed_assignees) VALUES
  (auth.uid(), 'Web Development', 'bg-blue-100 text-blue-700', ARRAY['Max Hoffmann', 'Anna Lutz']),
  (auth.uid(), 'Marketing Campaign', 'bg-green-100 text-green-700', ARRAY['Anna Lutz', 'Tom Weber']),
  (auth.uid(), 'Mobile App', 'bg-purple-100 text-purple-700', ARRAY['Max Hoffmann']);

-- Insert sample areas
INSERT INTO areas (user_id, name, color) VALUES
  (auth.uid(), 'Frontend', 'bg-orange-100 text-orange-700'),
  (auth.uid(), 'Backend', 'bg-red-100 text-red-700'),
  (auth.uid(), 'Design', 'bg-pink-100 text-pink-700');

-- Insert sample todos
INSERT INTO todos (user_id, title, description, priority, due_date, start_date, project, area, assignees) VALUES
  (auth.uid(), 'Design Landing Page', 'Create wireframes and mockups for the new landing page', 3, CURRENT_DATE + INTERVAL '3 days', CURRENT_DATE, 'Web Development', 'Frontend', ARRAY['Anna Lutz']),
  (auth.uid(), 'API Integration', 'Integrate third-party payment API', 4, CURRENT_DATE + INTERVAL '1 day', CURRENT_DATE, 'Web Development', 'Backend', ARRAY['Max Hoffmann']),
  (auth.uid(), 'User Testing', 'Conduct usability tests with 5 users', 2, CURRENT_DATE + INTERVAL '7 days', CURRENT_DATE + INTERVAL '5 days', 'Mobile App', 'Design', ARRAY['Tom Weber']);
*/ 