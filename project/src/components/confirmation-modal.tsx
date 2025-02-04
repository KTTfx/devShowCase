import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { Modal } from './ui/modal';
import { Button } from './ui/button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ConfirmationModal({ isOpen, onClose, onConfirm }: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-8 h-8 text-primary" />
        </motion.div>
        
        <h2 className="text-2xl font-bold mb-4">Submit Project?</h2>
        <p className="text-gray-400 mb-6">
          Your project will be reviewed by our team. You'll receive a notification once it's approved.
        </p>
        
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            className="flex-1"
            onClick={onConfirm}
          >
            Submit
          </Button>
        </div>
      </div>
    </Modal>
  );
}