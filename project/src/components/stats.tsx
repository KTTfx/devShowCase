import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Code2, Star, Zap } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: '0',
    label: 'Active Developers',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Code2,
    value: '0',
    label: 'Projects Launched',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Star,
    value: '0',
    label: 'GitHub Stars',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Zap,
    value: '0',
    label: 'Lines of Code',
    color: 'from-green-500 to-emerald-500',
  },
];

export function Stats() {
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);

  return (
    <section className="py-32 relative overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 0% 100%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 100% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <motion.div
        style={{ scale }}
        className="container mx-auto px-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="bg-card rounded-xl p-6 text-center relative overflow-hidden">
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                    whileHover={{
                      scale: [1, 1.2, 1],
                      transition: { duration: 1, repeat: Infinity },
                    }}
                  />
                  
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="inline-block mb-4"
                  >
                    <Icon className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg p-2 text-white`} />
                  </motion.div>
                  
                  <motion.h3
                    className="text-4xl font-bold mb-2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {stat.value}
                  </motion.h3>
                  
                  <p className="text-gray-400">{stat.label}</p>
                  
                  <motion.div
                    className="absolute bottom-0 left-0 w-full h-1"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  >
                    <div className={`h-full bg-gradient-to-r ${stat.color}`} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}