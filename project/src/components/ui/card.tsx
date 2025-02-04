import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradient?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        className={cn(
          'rounded-xl backdrop-blur-md bg-card p-6',
          gradient && 'bg-gradient-to-br from-primary/10 to-secondary/10 border border-white/10',
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export { Card };