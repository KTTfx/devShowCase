import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CallToAction() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

  return (
    <section className="py-16 sm:py-32 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 0%, rgba(236, 72, 153, 0.2) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 100%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        style={{ scale }}
        className="container mx-auto px-4"
      >
        <div className="bg-card rounded-2xl p-6 sm:p-12 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            style={{ rotate }}
            className="absolute -right-20 -top-20 w-40 h-40 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl"
          />
          <motion.div
            style={{ rotate: rotate.get() * -1 }}
            className="absolute -left-20 -bottom-20 w-40 h-40 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-3xl"
          />

          <div className="relative text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 sm:mb-8"
            >
              <Star className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto animate-pulse" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary via-secondary to-primary text-transparent bg-clip-text inline-block"
            >
              Ready to Showcase Your Magic?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4 sm:px-0"
            >
              Join thousands of developers who are already sharing their projects
              and making meaningful connections.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
            >
              <Link to="/submit" className="w-full sm:w-auto">
                <Button
                  variant="gradient"
                  size="lg"
                  className="group relative overflow-hidden w-full sm:w-auto"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                    animate={{
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  Get Started Now
                </Button>
              </Link>
              <Link to="/signin" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="group relative overflow-hidden w-full sm:w-auto"
                >
                  <motion.span
                    className="absolute inset-0 bg-primary/10"
                    initial={{ x: "100%" }}
                    whileHover={{ x: "-100%" }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">
                    View Projects
                  </span>
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}