import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type TechStack = Database['public']['Tables']['tech_stacks']['Row'];

export async function getTechStacks() {
  const { data, error } = await supabase
    .from('tech_stacks')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function createTechStack(name: string) {
  const { data, error } = await supabase
    .from('tech_stacks')
    .insert({ name })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function addProjectTechStacks(projectId: string, techStackIds: string[]) {
  const projectTechStacks = techStackIds.map(techStackId => ({
    project_id: projectId,
    tech_stack_id: techStackId
  }));

  const { error } = await supabase
    .from('project_tech_stacks')
    .insert(projectTechStacks);

  if (error) throw error;
}