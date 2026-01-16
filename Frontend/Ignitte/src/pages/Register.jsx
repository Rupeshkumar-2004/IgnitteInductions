import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const Register = () => {
  // 1. Added missing state variables
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: '',
    phone: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // 2. Sending ALL required fields to the backend
      await register(
        formData.fullName, 
        formData.email, 
        formData.password,
        formData.department,
        formData.phone
      );
      
      toast({
        title: 'Welcome!',
        description: 'Your account has been created successfully.',
      });
      navigate('/dashboard');
    } catch (error) {
      console.error("Registration Error:", error); // Check console for details
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/30 px-4 py-12">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Join us and start your educational journey</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input id="fullName" value={formData.fullName} onChange={handleChange} required placeholder="Enter your full name" />
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter your email" />
            </div>

            {/* Department (NEW) */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input id="department" value={formData.department} onChange={handleChange} required placeholder="e.g. Computer Science" />
            </div>

            {/* Phone (NEW) */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter 10-digit number" />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? 'text' : 'password'} 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                  placeholder="Create a password" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input 
                id="confirmPassword" 
                type={showPassword ? 'text' : 'password'} 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
                placeholder="Confirm your password" 
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</> : 'Create Account'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in here</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;