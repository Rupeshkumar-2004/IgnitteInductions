import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';

const extendedRegisterSchema = registerSchema.extend({
  confirmPassword: z.string().min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: "Passwords do not match",
});

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(extendedRegisterSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '', department: '', phone: '', rollNumber: '' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      await registerUser(
        data.fullName,
        data.email,
        data.password,
        data.department,
        data.phone,
        data.rollNumber
      );

      toast({
        title: 'Welcome!',
        description: 'Your account has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration Error:", error);
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col justify-center items-center p-margin-mobile md:p-margin-desktop font-body-md relative overflow-hidden pt-20">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary rounded-full opacity-5 blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md z-10 py-8">
        {/* Logo/Brand Anchor */}
        <div className="text-center mb-8">
          <h1 className="font-display-lg-mobile md:font-display-lg text-on-surface tracking-tight">
            IgnitteInductions<span className="text-primary-container">.</span>
          </h1>
          <p className="font-body-md text-on-surface-variant mt-2">Create your account</p>
        </div>

        {/* Registration Card */}
        <div className="bg-surface-container/30 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-8 flex flex-col gap-6 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                placeholder="John Doe"
                {...register("fullName")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              {errors.fullName && <p className="text-xs text-error mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="name@example.com"
                {...register("email")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="department">Department</label>
              <input
                id="department"
                placeholder="e.g. Computer Science"
                {...register("department")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              {errors.department && <p className="text-xs text-error mt-1">{errors.department.message}</p>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="rollNumber">Roll Number (Optional)</label>
              <input
                id="rollNumber"
                placeholder="e.g. 106121000"
                {...register("rollNumber")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              {errors.rollNumber && <p className="text-xs text-error mt-1">{errors.rollNumber.message}</p>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                placeholder="Enter 10-digit number"
                {...register("phone")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              {errors.phone && <p className="text-xs text-error mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="password">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 pr-12 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <span className="material-symbols-outlined text-[20px] select-none">visibility_off</span>
                  ) : (
                    <span className="material-symbols-outlined text-[20px] select-none">visibility</span>
                  )}
                </button>
              </div>
              {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block font-label-md text-on-surface-variant mb-1" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register("confirmPassword")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-2.5 px-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              {errors.confirmPassword && <p className="text-xs text-error mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <div className="mt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-container text-surface font-label-md text-label-md rounded-xl py-3 px-6 hover:opacity-95 transition-opacity duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-surface" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="border-t border-outline-variant/20 pt-4 text-center">
            <p className="font-body-md text-on-surface-variant">
              Already have an account?
              <Link to="/login" className="text-primary hover:text-primary-container transition-colors duration-200 font-label-md text-label-md ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;