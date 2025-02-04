/*
  # Project Submission Schema

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `timeline` (text, required)
      - `project_url` (text, required)
      - `screenshot_url` (text)
      - `status` (text, default: 'pending')
      - `likes_count` (int, default: 0)
      - `user_id` (uuid, references profiles)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique, required)
      - `created_at` (timestamp)
    
    - `project_categories`
      - `project_id` (uuid, references projects)
      - `category_id` (uuid, references categories)
      - Primary key: (project_id, category_id)
    
    - `tech_stacks`
      - `id` (uuid, primary key)
      - `name` (text, unique, required)
      - `created_at` (timestamp)
    
    - `project_tech_stacks`
      - `project_id` (uuid, references projects)
      - `tech_stack_id` (uuid, references tech_stacks)
      - Primary key: (project_id, tech_stack_id)
    
    - `project_likes`
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references profiles)
      - Primary key: (project_id, user_id)
    
    - `project_bookmarks`
      - `project_id` (uuid, references projects)
      - `user_id` (uuid, references profiles)
      - Primary key: (project_id, user_id)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Public read access for approved projects
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
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
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
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (project_id, user_id)
);

-- Create project_bookmarks table
CREATE TABLE IF NOT EXISTS project_bookmarks (
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
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