import { motion, useScroll, useTransform } from 'framer-motion';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "This platform transformed how I showcase my projects. The community feedback is invaluable!",
    author: "Sarah Chen",
    role: "Senior Developer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "Found amazing collaborators here. My startup gained incredible traction thanks to the exposure.",
    author: "Michael Rodriguez",
    role: "Startup Founder",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
  },
  {
    quote: "The quality of projects and developers here is outstanding. A must-visit for tech recruiters!",
    author: "Emma Thompson",
    role: "Tech Recruiter",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
  },
];

export function Testimonials() {
  const { scrollYProgress } = useScroll();
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section className="py-32 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 0% 100%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
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
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary text-transparent bg-clip-text inline-block">
            Developer Stories
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Hear from the amazing developers who've found success on our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              <div className="bg-card rounded-xl p-8 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"
                  whileHover={{
                    scale: [1, 1.2, 1],
                    transition: { duration: 1, repeat: Infinity },
                  }}
                />
                
                <motion.div
                  style={{ rotate }}
                  className="absolute -right-16 -top-16 w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
                />

                <div className="relative">
                  <Quote className="w-12 h-12 text-primary mb-6" />
                  
                  <p className="text-lg mb-6 text-gray-300">{testimonial.quote}</p>
                  
                  <div className="flex items-center gap-4">
                    <motion.img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}