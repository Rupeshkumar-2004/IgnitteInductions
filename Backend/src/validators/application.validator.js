import { z } from 'zod';

export const submitApplicationSchema = z.object({
  motivation: z.string().min(10, 'Motivation must be at least 10 characters long'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
  previousExperience: z.string().optional()
});

export const submitTaskSchema = z.object({
  submission: z.string().min(1, 'Submission content is required')
});
