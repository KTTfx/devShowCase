import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  Search,
  Plus,
  Bookmark,
  Layout,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { ProjectCard } from '../components/ui/project-card';
import { useAuth } from '../contexts/auth';
import { useProjects } from '../hooks/use-projects';

const TABS = [
  { id: 'all', label: 'All Projects', icon: Layout },
  { id: 'my-projects', label: 'My Projects', icon: User },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'settings', label: 'Settings', icon: Settings }
] as const;

type TabId = typeof TABS[number]['id'];

export function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = React.useState<TabId>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [notifications] = React.useState([
    { id: 1, message: 'Your project "AI Image Generator" was approved!' },
    { id: 2, message: 'New comment on your project' }
  ]);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const notificationRef = React.useRef<HTMLDivElement>(null);

  const {
    projects: allProjects,
    isLoading: isLoadingAll,
    error: errorAll,
    likedProjects,
    bookmarkedProjects,
    handleLike,
    handleBookmark
  } = useProjects('all');

  const {
    projects: userProjects,
    isLoading: isLoadingUser,
    error: errorUser
  } = useProjects('user');

  const {
    projects: bookmarkedProjectsList,
    isLoading: isLoadingBookmarks,
    error: errorBookmarks
  } = useProjects('bookmarks');

  const isLoading = isLoadingAll || isLoadingUser || isLoadingBookmarks;
  const error = errorAll || errorUser || errorBookmarks;

  // Close notifications when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <header className="fixed top-16 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-primary font-medium">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </motion.div>
              <div className="hidden sm:block">
                <h2 className="font-semibold">{user?.email}</h2>
                <p className="text-sm text-gray-400">Developer</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={notificationRef}>
                <motion.button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full" />
                  )}
                </motion.button>

                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-80 bg-card rounded-xl shadow-lg border border-primary/10 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">Notifications</h3>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-400 hover:text-white p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {notifications.map(notification => (
                      <div
                        key={notification.id}
                        className="py-2 border-b border-primary/10 last:border-0"
                      >
                        <p className="text-sm text-gray-400">{notification.message}</p>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 bg-card border border-primary/20 rounded-lg px-4 py-2 pr-10 focus:border-primary/50 transition-colors"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="sm:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-primary/20 rounded-lg px-4 py-2 pr-10 focus:border-primary/50 transition-colors"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 pt-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Menu */}
          <motion.nav
            initial={false}
            animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="flex flex-col gap-2 py-4">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-400 hover:bg-primary/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.nav>

          {/* Desktop Sidebar */}
          <motion.nav
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:w-64"
          >
            <div className="flex flex-col gap-2">
              {TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-400 hover:bg-primary/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </motion.nav>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            {activeTab === 'all' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">All Projects</h2>
                  <Link to="/submit">
                    <Button variant="gradient" className="group w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                      New Project
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {allProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
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

            {activeTab === 'my-projects' && (
              <div className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-2xl font-bold">My Projects</h2>
                  <Link to="/submit">
                    <Button variant="gradient" className="group w-full sm:w-auto">
                      <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                      New Project
                    </Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {userProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProjectCard
                        {...project}
                        isLiked={likedProjects.has(project.id)}
                        isBookmarked={bookmarkedProjects.has(project.id)}
                        onLike={() => handleLike(project.id)}
                        onBookmark={() => handleBookmark(project.id)}
                      />
                      {project.status === 'pending' && (
                        <div className="mt-2 flex items-center gap-2 text-yellow-500">
                          <motion.div
                            className="w-2 h-2 bg-yellow-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                          />
                          <span className="text-sm">Under Review</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Bookmarked Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {bookmarkedProjectsList.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <ProjectCard
                        {...project}
                        isLiked={likedProjects.has(project.id)}
                        isBookmarked={true}
                        onLike={() => handleLike(project.id)}
                        onBookmark={() => handleBookmark(project.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold">Settings</h2>
                <div className="bg-card rounded-xl p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Profile Picture
                    </label>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <motion.div
                        className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.05 }}
                      >
                        <span className="text-2xl font-medium text-primary">
                          {user?.email?.[0].toUpperCase()}
                        </span>
                      </motion.div>
                      <Button variant="outline" className="w-full sm:w-auto">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full bg-background border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors opacity-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Password
                    </label>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}