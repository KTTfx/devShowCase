import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type NewProject = Database['public']['Tables']['projects']['Insert'];

export async function getProjects() {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      timeline,
      project_url,
      screenshot_url,
      status,
      likes_count,
      created_at,
      updated_at,
      user_id,
      profiles!projects_user_id_fkey (
        username,
        full_name,
        avatar_url
      ),
      project_categories!inner (
        categories (
          name
        )
      ),
      project_tech_stacks!inner (
        tech_stacks (
          name
        )
      )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getUserProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select(`
      id,
      title,
      description,
      timeline,
      project_url,
      screenshot_url,
      status,
      likes_count,
      created_at,
      updated_at,
      user_id,
      project_categories!inner (
        categories (
          name
        )
      ),
      project_tech_stacks!inner (
        tech_stacks (
          name
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getBookmarkedProjects(userId: string) {
  const { data, error } = await supabase
    .from('project_bookmarks')
    .select(`
      project_id,
      projects!inner (
        id,
        title,
        description,
        timeline,
        project_url,
        screenshot_url,
        status,
        likes_count,
        created_at,
        updated_at,
        user_id,
        profiles!projects_user_id_fkey (
          username,
          full_name,
          avatar_url
        ),
        project_categories!inner (
          categories (
            name
          )
        ),
        project_tech_stacks!inner (
          tech_stacks (
            name
          )
        )
      )
    `)
    .eq('user_id', userId)
    .eq('projects.status', 'approved');

  if (error) throw error;
  return data.map(item => item.projects);
}

export async function createProject(project: NewProject) {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function isProjectLiked(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from('project_likes')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function isProjectBookmarked(projectId: string, userId: string) {
  const { data, error } = await supabase
    .from('project_bookmarks')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function likeProject(projectId: string, userId: string) {
  const { error } = await supabase
    .from('project_likes')
    .insert({ project_id: projectId, user_id: userId });

  if (error) throw error;
}

export async function unlikeProject(projectId: string, userId: string) {
  const { error } = await supabase
    .from('project_likes')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function bookmarkProject(projectId: string, userId: string) {
  const { error } = await supabase
    .from('project_bookmarks')
    .insert({ project_id: projectId, user_id: userId });

  if (error) throw error;
}

export async function unbookmarkProject(projectId: string, userId: string) {
  const { error } = await supabase
    .from('project_bookmarks')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId);

  if (error) throw error;
}