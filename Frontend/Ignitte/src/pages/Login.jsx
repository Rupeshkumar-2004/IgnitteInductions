import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validations';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const user = await login(data.email, data.password);

      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });

      if (user.role === 'admin') {
        navigate("/admin/dashboard", { replace: true });
      } else {
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-body-md p-margin-mobile md:p-margin-desktop bg-background relative overflow-hidden">
      {/* Ambient Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary-container/5 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary-container/5 blur-[100px]"></div>
      </div>

      {/* Login Container */}
      <main className="w-full max-w-md bg-surface-container/30 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Ignitte</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Sign in to your workspace</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block font-label-md text-label-md text-on-surface" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                mail
              </span>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-4 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
            </div>
            {errors.email && <p className="text-sm text-error mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
              <Link to="#" className="font-label-md text-label-md text-primary hover:text-primary-fixed transition-colors duration-200">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                lock
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full bg-surface-container/50 border border-outline-variant/30 rounded-xl py-3 pl-12 pr-12 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface focus:outline-none"
              >
                {showPassword ? (
                  <span className="material-symbols-outlined text-[20px] select-none">visibility_off</span>
                ) : (
                  <span className="material-symbols-outlined text-[20px] select-none">visibility</span>
                )}
              </button>
            </div>
            {errors.password && <p className="text-sm text-error mt-1">{errors.password.message}</p>}
          </div>

          {/* Sign In Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-container text-surface font-label-md text-label-md rounded-xl py-3 px-6 hover:opacity-95 transition-opacity duration-200 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-surface" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Registration Link */}
        <div className="mt-8 text-center border-t border-outline-variant/20 pt-6">
          <p className="font-body-md text-body-md text-on-surface-variant">
            New to Ignitte?
            <Link to="/register" className="text-primary hover:text-primary-fixed transition-colors duration-200 font-label-md text-label-md ml-1">
              Register
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Login;