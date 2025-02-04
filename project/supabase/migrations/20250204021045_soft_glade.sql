/*
  # Create Project Schema
  
  This migration creates the complete project schema including:
  1. Project management tables
  2. Categories and tech stacks
  3. User interactions (likes, bookmarks)
  4. Security policies
  5. Triggers and functions
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  timeline text NOT NULL,
  project_url text NOT NULL,
  screenshot_url text,
  status text NOT NULL DEFAULT 'pending',
  likes_count int NOT NULL DEFAULT 0,
  user_id uuid NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create project_categories junction table
CREATE TABLE IF NOT EXISTS project_categories (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

-- Create tech_stacks table
CREATE TABLE IF NOT EXISTS tech_stacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create project_tech_stacks junction table
CREATE TABLE IF NOT EXISTS project_tech_stacks (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  tech_stack_id uuid REFERENCES tech_stacks(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, tech_stack_id)
);

-- Create project_likes table
CREATE TABLE IF NOT EXISTS project_likes (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- Create project_bookmarks table
CREATE TABLE IF NOT EXISTS project_bookmarks (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_tech_stacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policies for projects
CREATE POLICY "Anyone can view approved projects"
  ON projects
  FOR SELECT
  USING (status = 'approved');

CREATE POLICY "Users can view their own pending projects"
  ON projects
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects"
  ON projects
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects"
  ON projects
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone"
  ON categories
  FOR SELECT
  USING (true);

-- Create policies for project_categories
CREATE POLICY "Project categories are viewable by everyone"
  ON project_categories
  FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their project categories"
  ON project_categories
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_categories.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create policies for tech_stacks
CREATE POLICY "Tech stacks are viewable by everyone"
  ON tech_stacks
  FOR SELECT
  USING (true);

-- Create policies for project_tech_stacks
CREATE POLICY "Project tech stacks are viewable by everyone"
  ON project_tech_stacks
  FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their project tech stacks"
  ON project_tech_stacks
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tech_stacks.project_id
      AND projects.user_id = auth.uid()
    )
  );

-- Create policies for project_likes
CREATE POLICY "Project likes are viewable by everyone"
  ON project_likes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON project_likes
  FOR ALL
  USING (auth.uid() = user_id);

-- Create policies for project_bookmarks
CREATE POLICY "Users can view their own bookmarks"
  ON project_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own bookmarks"
  ON project_bookmarks
  FOR ALL
  USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('AI & Machine Learning'),
  ('FinTech'),
  ('E-commerce'),
  ('Developer Tools'),
  ('Blockchain'),
  ('Productivity')
ON CONFLICT (name) DO NOTHING;

-- Create function to update project updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to update likes count
CREATE OR REPLACE FUNCTION update_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects
    SET likes_count = likes_count + 1
    WHERE id = NEW.project_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects
    SET likes_count = likes_count - 1
    WHERE id = OLD.project_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Create triggers for likes count
CREATE TRIGGER update_project_likes_count
  AFTER INSERT OR DELETE ON project_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_likes_count();

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS project_likes_counts_idx ON projects(likes_count DESC);
CREATE INDEX IF NOT EXISTS project_created_at_idx ON projects(created_at DESC);

-- Add a check constraint to ensure valid project status
ALTER TABLE projects 
  ADD CONSTRAINT projects_status_check 
  CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add a function to handle project approval
CREATE OR REPLACE FUNCTION handle_project_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changes to approved, update the approval timestamp
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for project approval
CREATE TRIGGER handle_project_approval_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION handle_project_approval();

-- Add policy for admin project management
CREATE POLICY "Admins can manage all projects"
  ON projects
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');