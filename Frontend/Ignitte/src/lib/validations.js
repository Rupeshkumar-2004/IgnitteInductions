// this file is used to validate the user input
// and it is used in the application form
import { z } from 'zod';

//register schema
export const registerSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  department: z.string().min(2, { message: 'Department is required.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  rollNumber: z.string()
});

//login schema
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' })
});

//application schema
export const applicationSchema = z.object({
  motivation: z.string().min(10, { message: 'Motivation must be at least 10 characters long.' }),
  skills: z.string().min(1, { message: 'Skills are required.' }),
  previousExperience: z.string().optional()
});

//task schema
export const taskSchema = z.object({
  submission: z.string().min(1, { message: 'Submission content is required.' })
});

//team member schema
export const teamMemberSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number.' }),
  department: z.string().min(1, { message: 'Department is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  role: z.enum(['interviewer', 'admin'], { message: 'Please select a valid role.' })
});
