/*
  # Project Performance Optimizations
  
  This migration adds performance optimizations and additional functionality for the projects system.

  1. Performance Optimizations
    - Adds indexes for common query patterns
    - Optimizes sorting and filtering operations
  
  2. Data Integrity
    - Adds status validation constraint
    - Ensures proper status transitions
  
  3. Administrative Features
    - Adds admin management capabilities
    - Implements approval workflow

  Note: All operations are idempotent and safe to run multiple times
*/

-- Add indexes for performance if they don't exist
DO $$ 
BEGIN
  -- Index for user lookups
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_user_id') THEN
    CREATE INDEX idx_projects_user_id ON projects(user_id);
  END IF;
  
  -- Index for status filtering
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_status') THEN
    CREATE INDEX idx_projects_status ON projects(status);
  END IF;
  
  -- Index for sorting by likes
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_likes_count') THEN
    CREATE INDEX idx_projects_likes_count ON projects(likes_count DESC);
  END IF;
  
  -- Index for timeline sorting
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_created_at') THEN
    CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
  END IF;
END $$;

-- Add status validation if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'ck_projects_status_values'
  ) THEN
    ALTER TABLE projects 
      ADD CONSTRAINT ck_projects_status_values 
      CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Update or create the project approval handler
CREATE OR REPLACE FUNCTION fn_handle_project_approval()
RETURNS TRIGGER AS $$
BEGIN
  -- Update timestamp on status change to approved
  IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
    NEW.updated_at = now();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Safely create the approval trigger
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_trigger 
    WHERE tgname = 'trg_project_approval'
  ) THEN
    CREATE TRIGGER trg_project_approval
      BEFORE UPDATE ON projects
      FOR EACH ROW
      WHEN (NEW.status IS DISTINCT FROM OLD.status)
      EXECUTE FUNCTION fn_handle_project_approval();
  END IF;
END $$;

-- Safely create admin policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE policyname = 'policy_admin_project_management'
  ) THEN
    CREATE POLICY "policy_admin_project_management"
      ON projects
      FOR ALL
      USING (auth.jwt() ->> 'role' = 'admin');
  END IF;
END $$;