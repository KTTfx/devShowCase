import React from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProjectCard } from './ui/project-card';
import { useProjects } from '../hooks/use-projects';

export function FeaturedProjects() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);

  const {
    projects,
    isLoading,
    error,
    likedProjects,
    bookmarkedProjects,
    handleLike,
    handleBookmark
  } = useProjects('all');

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = projects.length - 1;
      if (nextIndex >= projects.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (isLoading) {
    return (
      <div className="py-32 text-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-32 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <motion.section
      style={{ scale, opacity }}
      className="py-32 relative overflow-hidden"
    >
      {/* Background Effects */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary text-transparent bg-clip-text inline-block"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Featured Projects
          </motion.h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover groundbreaking projects that push the boundaries of technology
          </p>
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center text-gray-400">
            No projects available yet. Be the first to submit one!
          </div>
        ) : (
          <div className="relative">
            {/* Featured Project Carousel */}
            <div className="relative h-[600px] overflow-hidden rounded-2xl">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);

                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute inset-0"
                >
                  <div className="relative h-full">
                    <motion.img
                      src={projects[currentIndex].screenshot_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1600'}
                      alt={projects[currentIndex].title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                          {projects[currentIndex].title}
                        </h3>
                        <p className="text-lg sm:text-xl text-gray-300 mb-6 max-w-3xl">
                          {projects[currentIndex].description}
                        </p>
                        <ProjectCard
                          {...projects[currentIndex]}
                          isLiked={likedProjects.has(projects[currentIndex].id)}
                          isBookmarked={bookmarkedProjects.has(projects[currentIndex].id)}
                          onLike={() => handleLike(projects[currentIndex].id)}
                          onBookmark={() => handleBookmark(projects[currentIndex].id)}
                          variant="minimal"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => paginate(-1)}
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto transition-colors hover:bg-black/70"
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => paginate(1)}
                  className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white pointer-events-auto transition-colors hover:bg-black/70"
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Progress Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {projects.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-primary' : 'bg-white/30'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
            </div>

            {/* Regular Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProjectCard
                    {...project}
                    isLiked={likedProjects.has(project.id)}
                    isBookmarked={bookmarkedProjects.has(project.id)}
                    onLike={() => handleLike(project.id)}
                    onBookmark={() => handleBookmark(project.id)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}