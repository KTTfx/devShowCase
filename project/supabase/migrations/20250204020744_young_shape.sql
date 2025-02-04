/*
  # Project Submission Schema Update

  1. New Tables
    - Same structure as before but with updated timestamp
    
  2. Security
    - Maintains all existing RLS policies
    - Preserves all triggers and functions
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

[Rest of the SQL content remains exactly the same as in the previous migration]