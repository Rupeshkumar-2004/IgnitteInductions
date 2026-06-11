import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required (min 2 characters)'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  department: z.string().min(2, 'Department is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  rollNumber: z.string().optional(),
  role: z.enum(['student', 'admin', 'interviewer']).optional()
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});
