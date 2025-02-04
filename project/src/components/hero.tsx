import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from './ui/button';
import { Code2, Terminal, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Hero() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  return (
    <section className="min-h-[100svh] flex items-center justify-center relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-8 bg-primary/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, 100],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 2,
            }}
          />
        ))}
        
        {/* Tech grid background */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="mb-8 inline-block"
          >
            <motion.div
              className="relative w-24 h-24 bg-background rounded-lg p-4 border border-primary/30"
              animate={{ 
                rotateY: 360,
                boxShadow: ['0 0 20px rgba(59, 130, 246, 0.3)', '0 0 40px rgba(59, 130, 246, 0.5)', '0 0 20px rgba(59, 130, 246, 0.3)']
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Terminal className="w-full h-full text-primary" />
              <motion.div
                className="absolute inset-0 border border-primary/30 rounded-lg"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-5xl sm:text-6xl md:text-8xl font-bold mb-6 relative"
          >
            <motion.div
              className="relative inline-block"
              animate={{
                rotateX: [0, 10, 0],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <motion.span
                className="bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                BUILD
              </motion.span>
            </motion.div>
            <br />
            <motion.div
              className="relative inline-block"
              animate={{
                rotateX: [0, -10, 0],
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            >
              <motion.span
                className="bg-gradient-to-r from-secondary to-primary text-transparent bg-clip-text inline-block"
                animate={{
                  backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                SHOWCASE
              </motion.span>
            </motion.div>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl text-gray-400 mb-8 sm:mb-12 max-w-2xl mx-auto"
          >
            Powerful tools for developers who mean business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center px-4 sm:px-0"
          >
            <Link to="/submit" className="w-full sm:w-auto">
              <Button
                variant="gradient"
                size="lg"
                className="group relative overflow-hidden w-full sm:w-auto"
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                <span className="relative z-10 flex items-center">
                  <motion.span
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Code2 className="w-5 h-5" />
                  </motion.span>
                  Submit Project
                </span>
              </Button>
            </Link>
            
            <Button
              variant="outline"
              size="lg"
              className="group relative overflow-hidden w-full sm:w-auto"
            >
              <motion.span
                className="absolute inset-0 bg-primary/10"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <span className="relative z-10 flex items-center">
                <motion.span
                  animate={{
                    rotate: [0, -360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="mr-2"
                >
                  <Shield className="w-5 h-5" />
                </motion.span>
                View Projects
              </span>
            </Button>
          </motion.div>

          {/* Tech circuit lines */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0"
                style={{
                  width: '100%',
                  top: `${(i + 1) * 20}%`,
                  left: 0,
                }}
                animate={{
                  x: ['-100%', '100%'],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}