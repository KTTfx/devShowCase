export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          timeline: string
          project_url: string
          screenshot_url: string | null
          status: 'pending' | 'approved' | 'rejected'
          likes_count: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          timeline: string
          project_url: string
          screenshot_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          likes_count?: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          timeline?: string
          project_url?: string
          screenshot_url?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          likes_count?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      project_categories: {
        Row: {
          project_id: string
          category_id: string
        }
        Insert: {
          project_id: string
          category_id: string
        }
        Update: {
          project_id?: string
          category_id?: string
        }
      }
      tech_stacks: {
        Row: {
          id: string
          name: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          created_at?: string
        }
      }
      project_tech_stacks: {
        Row: {
          project_id: string
          tech_stack_id: string
        }
        Insert: {
          project_id: string
          tech_stack_id: string
        }
        Update: {
          project_id?: string
          tech_stack_id?: string
        }
      }
      project_likes: {
        Row: {
          project_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          created_at?: string
        }
      }
      project_bookmarks: {
        Row: {
          project_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          project_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          project_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}