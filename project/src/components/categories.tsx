import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Briefcase, ShoppingBag, Brain, Rocket, Zap } from 'lucide-react';

const categories = [
  {
    name: 'AI & Machine Learning',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'FinTech',
    icon: Briefcase,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    name: 'E-commerce',
    icon: ShoppingBag,
    color: 'from-green-500 to-emerald-500',
  },
  {
    name: 'Developer Tools',
    icon: Code2,
    color: 'from-orange-500 to-yellow-500',
  },
  {
    name: 'Blockchain',
    icon: Rocket,
    color: 'from-red-500 to-pink-500',
  },
  {
    name: 'Productivity',
    icon: Zap,
    color: 'from-indigo-500 to-purple-500',
  },
];

export function Categories() {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Dynamic background */}
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

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -100, 0],
            opacity: [0, 1, 0],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 2,
          }}
        />
      ))}

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary text-transparent bg-clip-text inline-block">
            Explore Categories
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Discover projects across different domains and technologies
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => {
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group cursor-pointer"
              >
                <div className="relative bg-card rounded-xl p-6 border border-primary/5 overflow-hidden">
                  {/* Glitch effect on hover */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                    initial={false}
                    animate={{
                      clipPath: [
                        'inset(0 0 0 0)',
                        'inset(10% -6px 85% 0)',
                        'inset(85% -6px 0 0)',
                        'inset(0 0 0 0)',
                      ],
                      x: [0, -4, 4, 0],
                    }}
                    transition={{
                      duration: 0.4,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10`} />
                  </motion.div>

                  <div className="relative">
                    <motion.div
                      className="mb-4 inline-block"
                      whileHover={{
                        rotate: 360,
                        transition: { duration: 0.5 },
                      }}
                    >
                      <Icon className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-lg p-2 text-white`} />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                      <p className="text-gray-400">
                        0 projects
                      </p>
                    </motion.div>

                    {/* Tech circuit lines */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className={`absolute h-px bg-gradient-to-r ${category.color} opacity-20`}
                          style={{
                            width: '100%',
                            top: `${(i + 1) * 25}%`,
                            left: 0,
                          }}
                          animate={{
                            scaleX: [0, 1],
                            opacity: [0, 0.2, 0],
                            x: ['-100%', '100%'],
                          }}
                          transition={{
                            duration: 2 + i * 0.5,
                            repeat: Infinity,
                            repeatType: 'loop',
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}