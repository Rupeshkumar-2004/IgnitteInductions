import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  department: z.string().min(2, { message: 'Department is required.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  rollNumber: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

export const applicationSchema = z.object({
  motivation: z.string().min(10, { message: 'Motivation must be at least 10 characters long.' }),
  skills: z.string().min(1, { message: 'Skills are required.' }),
  previousExperience: z.string().optional()
});

export const taskSchema = z.object({
  submission: z.string().min(1, { message: 'Submission content is required.' })
});
