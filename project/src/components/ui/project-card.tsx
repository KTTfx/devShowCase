import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Bookmark, Github, Globe } from 'lucide-react';
import { Card } from './card';
import type { Database } from '../../types/database';

type Project = Database['public']['Tables']['projects']['Row'] & {
  profiles?: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  project_categories?: {
    categories: {
      name: string;
    };
  }[];
  project_tech_stacks?: {
    tech_stacks: {
      name: string;
    };
  }[];
};

interface ProjectCardProps extends Project {
  isLiked?: boolean;
  isBookmarked?: boolean;
  onLike?: () => void;
  onBookmark?: () => void;
  variant?: 'default' | 'minimal';
}

export function ProjectCard({
  title,
  description,
  screenshot_url,
  project_url,
  likes_count,
  profiles,
  project_tech_stacks,
  isLiked = false,
  isBookmarked = false,
  onLike,
  onBookmark,
  variant = 'default'
}: ProjectCardProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {profiles && (
            <img
              src={profiles.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profiles.username}`}
              alt={profiles.full_name || profiles.username}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-medium">{profiles?.full_name || profiles?.username}</p>
            <p className="text-xs text-gray-400">@{profiles?.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={onLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1 ${
              isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes_count}</span>
          </motion.button>
          
          <motion.button
            onClick={onBookmark}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`${
              isBookmarked ? 'text-primary' : 'text-gray-400 hover:text-primary'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <Card gradient className="group h-full relative">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
        whileHover={{
          scale: [1, 1.02, 1],
          transition: { duration: 1, repeat: Infinity },
        }}
      />
      
      <div className="relative">
        <motion.img
          src={screenshot_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'}
          alt={title}
          className="w-full h-48 object-cover rounded-lg mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        
        <div className="absolute top-2 right-2 flex gap-2">
          <motion.button
            onClick={onLike}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 ${
              isLiked ? 'text-red-500' : 'text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm">{likes_count}</span>
          </motion.button>
          
          <motion.button
            onClick={onBookmark}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`bg-black/50 backdrop-blur-sm rounded-full p-2 ${
              isBookmarked ? 'text-primary' : 'text-white'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </motion.button>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
        {title}
      </h3>
      
      <p className="text-gray-400 mb-4">{description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project_tech_stacks?.map(({ tech_stacks }) => (
          <motion.span
            key={tech_stacks.name}
            className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary"
            whileHover={{ scale: 1.05 }}
          >
            {tech_stacks.name}
          </motion.span>
        ))}
      </div>
      
      <div className="flex gap-4">
        <motion.a
          href={project_url}
          className="text-gray-400 hover:text-primary transition-colors"
          whileHover={{ scale: 1.1, rotate: 5 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Github size={20} />
        </motion.a>
        <motion.a
          href={project_url}
          className="text-gray-400 hover:text-primary transition-colors"
          whileHover={{ scale: 1.1, rotate: -5 }}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Globe size={20} />
        </motion.a>
      </div>

      {profiles && (
        <div className="mt-4 pt-4 border-t border-primary/10 flex items-center gap-3">
          <img
            src={profiles.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${profiles.username}`}
            alt={profiles.full_name || profiles.username}
            className="w-8 h-8 rounded-full"
          />
          <div>
            <p className="text-sm font-medium">{profiles.full_name}</p>
            <p className="text-xs text-gray-400">@{profiles.username}</p>
          </div>
        </div>
      )}
    </Card>
  );
}