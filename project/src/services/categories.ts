import { supabase } from '../lib/supabase';
import type { Database } from '../types/database';

type Category = Database['public']['Tables']['categories']['Row'];

export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data;
}

export async function addProjectCategories(projectId: string, categoryIds: string[]) {
  const projectCategories = categoryIds.map(categoryId => ({
    project_id: projectId,
    category_id: categoryId
  }));

  const { error } = await supabase
    .from('project_categories')
    .insert(projectCategories);

  if (error) throw error;
}