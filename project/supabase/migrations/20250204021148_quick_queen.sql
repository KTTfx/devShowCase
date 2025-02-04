/*
  # Add Project Indexes and Constraints
  
  This migration adds:
  1. Performance indexes
  2. Status constraints
  3. Approval handling
  
  Note: Uses safe DDL that checks for existing objects
*/

-- Add indexes for performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'projects_user_id_idx') THEN
    CREATE INDEX projects_user_id_idx ON projects(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'projects_status_idx') THEN
    CREATE INDEX projects_status_idx ON projects(status);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'project_likes_counts_idx') THEN
    CREATE INDEX project_likes_counts_idx ON projects(likes_count DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'project_created_at_idx') THEN
    CREATE INDEX project_created_at_idx ON projects(created_at DESC);
  END IF;
END $$;

-- Add status constraint if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'projects_status_check'
  ) THEN
    ALTER TABLE projects 
      ADD CONSTRAINT projects_status_check 
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Update or create the project approval function
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

-- Safely create the project approval trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'handle_project_approval_trigger'
  ) THEN
    CREATE TRIGGER handle_project_approval_trigger
      BEFORE UPDATE ON projects
      FOR EACH ROW
      WHEN (NEW.status IS DISTINCT FROM OLD.status)
      EXECUTE FUNCTION handle_project_approval();
  END IF;
END $$;

-- Safely create admin policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE policyname = 'Admins can manage all projects'
  ) THEN
    CREATE POLICY "Admins can manage all projects"
      ON projects
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;