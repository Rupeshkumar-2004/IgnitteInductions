import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { applicationSchema } from '@/lib/validations';
import { useSubmitApplication } from '@/hooks/useApplicationQueries';

const ApplicationForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const submitApplication = useSubmitApplication();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      motivation: '',
      skills: '',
      previousExperience: '',
    }
  });

  const onSubmit = async (data) => {
    // Backend expects skills as an array of strings
    const payload = {
      ...data,
      skills: data.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
    };

    submitApplication.mutate(payload, {
      onSuccess: () => {
        setIsSubmitted(true);
        toast({
          title: 'Application Submitted!',
          description: 'We will review your application and get back to you soon.',
        });
      },
      onError: (error) => {
        toast({
          title: 'Submission failed',
          description: error.response?.data?.message || 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] bg-primary-container rounded-full opacity-5 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] bg-tertiary rounded-full opacity-5 blur-[100px] pointer-events-none"></div>
        
        <div className="w-full max-w-md bg-surface-container/20 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-8 text-center shadow-2xl relative z-10">
          <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-4xl text-green-400">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-on-surface mb-3">Application Submitted!</h2>
          <p className="font-body-md text-on-surface-variant mb-8">
            Thank you for your application. Our team will review it and contact you soon.
          </p>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-primary-container text-surface font-label-md text-label-md py-3.5 rounded-xl hover:opacity-90 transition-opacity duration-300 cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md relative overflow-x-hidden pt-24 pb-16">
      {/* Ambient background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary rounded-full opacity-5 blur-[100px] pointer-events-none"></div>

      <main className="flex-grow px-6 md:px-12 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-[800px] bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="font-headline-xl text-[36px] font-bold text-primary-container mb-2">
              Teaching Application
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
              Join our mission to empower JEE aspirants through quality peer mentoring and build the next generation of scholars.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Motivation field */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="motivation">
                Why do you want to join this program? *
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
                  psychology
                </span>
                <textarea
                  id="motivation"
                  placeholder="Explain your motivation for mentoring students..."
                  {...register("motivation")}
                  rows={4}
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/30 font-body-md text-body-md resize-none"
                />
              </div>
              {errors.motivation && (
                <p className="text-xs text-error font-medium mt-1">{errors.motivation.message}</p>
              )}
            </div>

            {/* Skills field */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="skills">
                Skills * (comma separated)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  code
                </span>
                <input
                  id="skills"
                  type="text"
                  placeholder="e.g. Physics, Chemistry, Calculus, Public Speaking"
                  {...register("skills")}
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all rounded-xl py-3.5 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/30 font-body-md text-body-md"
                />
              </div>
              {errors.skills && (
                <p className="text-xs text-error font-medium mt-1">{errors.skills.message}</p>
              )}
            </div>

            {/* Previous Experience field */}
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface" htmlFor="previousExperience">
                Previous Experience (Optional)
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
                  history
                </span>
                <textarea
                  id="previousExperience"
                  placeholder="Describe any past teaching or mentoring experience..."
                  {...register("previousExperience")}
                  rows={4}
                  className="w-full bg-surface-container-lowest/50 border border-outline-variant/30 focus:border-primary-container focus:ring-1 focus:ring-primary-container focus:outline-none transition-all rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant/30 font-body-md text-body-md resize-none"
                />
              </div>
              {errors.previousExperience && (
                <p className="text-xs text-error font-medium mt-1">{errors.previousExperience.message}</p>
              )}
            </div>

            {/* Submit Actions */}
            <div className="pt-6 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-xs text-on-surface-variant/60">
                By submitting, you agree to the club's code of conduct and teaching commitments.
              </p>
              <button 
                type="submit" 
                disabled={submitApplication.isPending}
                className="w-full sm:w-auto bg-primary-container text-surface font-label-md text-label-md px-8 py-3.5 rounded-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitApplication.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-surface" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Application
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ApplicationForm;