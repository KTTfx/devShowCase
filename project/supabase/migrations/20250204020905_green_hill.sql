/*
  # Add Missing Project Features
  
  This migration adds any missing functionality to the existing project schema.
  Since the base tables and policies are already created, we'll only add new features
  and make any necessary modifications.
*/

-- Add any missing indexes for performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx ON projects(user_id);
CREATE INDEX IF NOT EXISTS projects_status_idx ON projects(status);
CREATE INDEX IF NOT EXISTS project_likes_counts_idx ON projects(likes_count DESC);
CREATE INDEX IF NOT EXISTS project_created_at_idx ON projects(created_at DESC);

-- Add a check constraint to ensure valid project status
DO $$ 
BEGIN
  ALTER TABLE projects 
    ADD CONSTRAINT projects_status_check 
    CHECK (status IN ('pending', 'approved', 'rejected'));
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;

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
DROP TRIGGER IF EXISTS handle_project_approval_trigger ON projects;
CREATE TRIGGER handle_project_approval_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
  WHEN (NEW.status IS DISTINCT FROM OLD.status)
  EXECUTE FUNCTION handle_project_approval();

-- Add policy for admin project management (if needed)
DO $$ 
BEGIN
  CREATE POLICY "Admins can manage all projects"
    ON projects
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin');
EXCEPTION
  WHEN duplicate_object THEN
    NULL;
END $$;