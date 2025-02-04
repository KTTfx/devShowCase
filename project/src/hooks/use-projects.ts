import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/auth';
import {
  getProjects,
  getUserProjects,
  getBookmarkedProjects,
  isProjectLiked,
  isProjectBookmarked,
  likeProject,
  unlikeProject,
  bookmarkProject,
  unbookmarkProject
} from '../services/projects';
import type { Database } from '../types/database';

type Project = Database['public']['Tables']['projects']['Row'];

export function useProjects(type: 'all' | 'user' | 'bookmarks' = 'all') {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [bookmarkedProjects, setBookmarkedProjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchProjects() {
      if (!user && (type === 'user' || type === 'bookmarks')) {
        setProjects([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        let fetchedProjects: Project[];
        switch (type) {
          case 'user':
            fetchedProjects = await getUserProjects(user!.id);
            break;
          case 'bookmarks':
            fetchedProjects = await getBookmarkedProjects(user!.id);
            break;
          default:
            fetchedProjects = await getProjects();
        }

        // Fetch like and bookmark status for each project
        if (user) {
          const likedStatus = await Promise.all(
            fetchedProjects.map(p => isProjectLiked(p.id, user.id))
          );
          const bookmarkedStatus = await Promise.all(
            fetchedProjects.map(p => isProjectBookmarked(p.id, user.id))
          );

          setLikedProjects(new Set(
            fetchedProjects
              .filter((_, i) => likedStatus[i])
              .map(p => p.id)
          ));
          setBookmarkedProjects(new Set(
            fetchedProjects
              .filter((_, i) => bookmarkedStatus[i])
              .map(p => p.id)
          ));
        }

        setProjects(fetchedProjects);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProjects();
  }, [type, user]);

  const handleLike = async (projectId: string) => {
    if (!user) return;

    try {
      const isLiked = likedProjects.has(projectId);
      if (isLiked) {
        await unlikeProject(projectId, user.id);
        setLikedProjects(prev => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
      } else {
        await likeProject(projectId, user.id);
        setLikedProjects(prev => new Set([...prev, projectId]));
      }

      // Update the likes count in the UI
      setProjects(prev =>
        prev.map(p =>
          p.id === projectId
            ? { ...p, likes_count: p.likes_count + (isLiked ? -1 : 1) }
            : p
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update like status');
    }
  };

  const handleBookmark = async (projectId: string) => {
    if (!user) return;

    try {
      const isBookmarked = bookmarkedProjects.has(projectId);
      if (isBookmarked) {
        await unbookmarkProject(projectId, user.id);
        setBookmarkedProjects(prev => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
      } else {
        await bookmarkProject(projectId, user.id);
        setBookmarkedProjects(prev => new Set([...prev, projectId]));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update bookmark status');
    }
  };

  return {
    projects,
    isLoading,
    error,
    likedProjects,
    bookmarkedProjects,
    handleLike,
    handleBookmark,
  };
}