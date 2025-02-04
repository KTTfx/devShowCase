import React from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ConfirmationModal } from '../components/confirmation-modal';

const projectSchema = z.object({
  title: z.string().min(1).max(50),
  description: z.string().min(1).max(500),
  category: z.string().min(1),
  techStack: z.array(z.string()).min(1),
  timeline: z.string().min(1),
  projectUrl: z.string().url(),
  screenshot: z.any(),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categories = [
  'AI & Machine Learning',
  'FinTech',
  'E-commerce',
  'Developer Tools',
  'Blockchain',
  'Productivity',
];

export function SubmitProject() {
  const navigate = useNavigate();
  const [isConfirmationOpen, setIsConfirmationOpen] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<ProjectFormData | null>(null);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const [techInput, setTechInput] = React.useState('');
  const [techStack, setTechStack] = React.useState<string[]>([]);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setValue('screenshot', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [setValue]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const addTech = () => {
    if (techInput && !techStack.includes(techInput)) {
      const newTechStack = [...techStack, techInput];
      setTechStack(newTechStack);
      setValue('techStack', newTechStack);
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    const newTechStack = techStack.filter(t => t !== tech);
    setTechStack(newTechStack);
    setValue('techStack', newTechStack);
  };

  const onSubmit = (data: ProjectFormData) => {
    setSubmittedData(data);
    setIsConfirmationOpen(true);
  };

  const handleConfirmSubmit = async () => {
    if (submittedData) {
      try {
        // Here you would typically:
        // 1. Upload the project data to your backend
        // 2. Handle the screenshot upload
        // 3. Create necessary database records
        
        // For now, we'll simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Close the modal
        setIsConfirmationOpen(false);
        
        // Redirect to the dashboard
        navigate('/', {
          state: {
            message: "Project submitted successfully! We'll notify you once it's reviewed.",
            type: 'success'
          }
        });
      } catch (error) {
        console.error('Error submitting project:', error);
        // Handle error state
      }
    }
  };

  const formData = watch();

  return (
    <>
      <div className="min-h-screen py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary text-transparent bg-clip-text inline-block">
              Submit Your Project
            </h1>
            <p className="text-lg sm:text-xl text-gray-400">
              Share your creation with the developer community
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.form
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-8"
              onSubmit={handleSubmit(onSubmit)}
            >
              {/* Basic Details */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Basic Details</h2>
                
                <div>
                  <input
                    {...register('title')}
                    placeholder="Project Title"
                    className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors text-foreground"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div>
                  <textarea
                    {...register('description')}
                    placeholder="Project Description"
                    rows={4}
                    className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors text-foreground"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                  )}
                </div>

                <div>
                  <select
                    {...register('category')}
                    className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors text-foreground"
                  >
                    <option value="" className="bg-background text-foreground">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-background text-foreground">
                        {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Technical Details</h2>
                
                <div>
                  <div className="flex flex-col sm:flex-row gap-2 mb-2">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      placeholder="Add Technology"
                      className="flex-1 bg-card border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors text-foreground"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    />
                    <Button 
                      type="button" 
                      onClick={addTech}
                      className="w-full sm:w-auto"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map(tech => (
                      <span
                        key={tech}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTech(tech)}
                          className="hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.techStack && (
                    <p className="text-red-500 text-sm mt-1">{errors.techStack.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register('timeline')}
                    placeholder="Development Timeline (e.g., 3 months)"
                    className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors text-foreground"
                  />
                  {errors.timeline && (
                    <p className="text-red-500 text-sm mt-1">{errors.timeline.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register('projectUrl')}
                    placeholder="Project URL (GitHub or Live Demo)"
                    className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:border-primary/50 transition-colors text-foreground"
                  />
                  {errors.projectUrl && (
                    <p className="text-red-500 text-sm mt-1">{errors.projectUrl.message}</p>
                  )}
                </div>
              </div>

              {/* Screenshot Upload */}
              <div className="space-y-4">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Project Screenshot</h2>
                
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed border-primary/20 rounded-lg p-4 sm:p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? 'border-primary' : ''
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-8 sm:w-12 h-8 sm:h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm sm:text-base">
                    {isDragActive
                      ? 'Drop the file here'
                      : 'Drag & drop a screenshot, or click to select'}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">
                    PNG or JPG (max. 5MB)
                  </p>
                </div>
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setValue('screenshot', null);
                      }}
                      className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full hover:bg-black/70"
                    >
                      <X size={20} />
                    </button>
                  </div>
                )}
              </div>

              <Button type="submit" variant="gradient" size="lg" className="w-full">
                Submit Project
              </Button>
            </motion.form>

            {/* Preview */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1 order-first lg:order-last"
            >
              <div className="sticky top-24">
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Preview</h2>
                <div className="bg-card rounded-xl p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-bold mb-2">
                    {formData.title || 'Project Title'}
                  </h3>
                  <p className="text-gray-400 text-sm sm:text-base mb-4">
                    {formData.description || 'Project description will appear here'}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {techStack.map(tech => (
                      <span
                        key={tech}
                        className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-full rounded-lg mb-4"
                    />
                  )}
                  <div className="text-xs sm:text-sm text-gray-400">
                    <p>Timeline: {formData.timeline || 'Not specified'}</p>
                    <p>Category: {formData.category || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={handleConfirmSubmit}
      />
    </>
  );
}