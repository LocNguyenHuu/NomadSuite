import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { LucideIcon, Plus, ArrowRight } from 'lucide-react';
import { fadeInUp, scaleIn } from '@/lib/motion';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  variant?: 'default' | 'minimal' | 'card';
  iconColor?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  variant = 'default',
  iconColor = 'text-primary',
  className = ''
}: EmptyStateProps) {
  const content = (
    <motion.div 
      className={`flex flex-col items-center justify-center text-center ${
        variant === 'minimal' ? 'py-8' : 'py-12 px-6'
      } ${className}`}
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
    >
      <motion.div 
        className={`relative mb-6 ${variant === 'minimal' ? 'mb-4' : ''}`}
        variants={scaleIn}
      >
        <div className={`
          p-4 rounded-2xl 
          ${variant === 'minimal' 
            ? 'bg-muted/50' 
            : 'bg-gradient-to-br from-primary/10 to-violet-500/10 ring-1 ring-primary/5'
          }
        `}>
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-violet-500/20 rounded-2xl blur-lg opacity-50 -z-10" />
      </motion.div>
      
      <motion.h3 
        className={`font-semibold mb-2 ${
          variant === 'minimal' ? 'text-base' : 'text-lg'
        }`}
        variants={fadeInUp}
      >
        {title}
      </motion.h3>
      
      <motion.p 
        className={`text-muted-foreground max-w-sm ${
          variant === 'minimal' ? 'text-sm' : 'text-sm'
        }`}
        variants={fadeInUp}
      >
        {description}
      </motion.p>
      
      {(actionLabel || secondaryActionLabel) && (
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-3 mt-6"
          variants={fadeInUp}
        >
          {actionLabel && onAction && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && onSecondaryAction && (
            <Button variant="outline" onClick={onSecondaryAction} className="gap-2">
              {secondaryActionLabel}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );

  if (variant === 'card') {
    return (
      <div className="rounded-xl border bg-card shadow-sm">
        {content}
      </div>
    );
  }

  return content;
}

interface EmptyStateGridProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyStateGrid({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateGridProps) {
  return (
    <motion.div 
      className="col-span-full flex flex-col items-center justify-center text-center py-16 px-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative mb-6">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 ring-1 ring-border/50">
          <Icon className="h-10 w-10 text-muted-foreground" />
        </div>
        <motion.div 
          className="absolute inset-0 rounded-2xl bg-primary/5"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="lg" className="gap-2">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
}

interface EmptyStateTableProps {
  icon: LucideIcon;
  title: string;
  description: string;
  colSpan?: number;
}

export function EmptyStateTable({
  icon: Icon,
  title,
  description,
  colSpan = 6
}: EmptyStateTableProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="h-48">
        <motion.div 
          className="flex flex-col items-center justify-center text-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-3 rounded-xl bg-muted/50 mb-4">
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">{title}</p>
          <p className="text-muted-foreground text-xs mt-1 max-w-xs">{description}</p>
        </motion.div>
      </td>
    </tr>
  );
}
