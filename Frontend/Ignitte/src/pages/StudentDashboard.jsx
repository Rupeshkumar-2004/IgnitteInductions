import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMyApplication, useSubmitTask } from '@/hooks/useApplicationQueries';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [submissionLinks, setSubmissionLinks] = useState({});
  const [submittingId, setSubmittingId] = useState(null);
  const { toast } = useToast();

  const { data: application, isLoading } = useMyApplication();
  const submitTaskMutation = useSubmitTask();

  const handleLinkChange = (taskId, value) => {
    setSubmissionLinks(prev => ({
      ...prev,
      [taskId]: value
    }));
  };

  const handleTaskSubmit = async (taskId) => {
    const link = submissionLinks[taskId];
    if (!link) {
      toast({
        title: "Submission Empty",
        description: "Please enter a valid link for submission.",
        variant: "destructive"
      });
      return;
    }
    
    setSubmittingId(taskId);
    submitTaskMutation.mutate(
      { taskId, link },
      {
        onSuccess: () => {
          toast({ title: "Task Submitted", description: "Your work has been sent for review." });
          setSubmissionLinks(prev => ({
            ...prev,
            [taskId]: ''
          }));
        },
        onError: (error) => {
          toast({ title: "Error", description: error.response?.data?.message || "Could not submit task", variant: "destructive" });
        },
        onSettled: () => {
          setSubmittingId(null);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <Loader2 className="h-8 w-8 animate-spin text-primary-container mb-4" />
        <p className="font-body-md text-on-surface-variant">Loading dashboard details...</p>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background relative p-6">
        <div className="bg-surface-container/30 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <span className="material-symbols-outlined text-5xl text-primary-container mb-4">
            assignment_late
          </span>
          <h2 className="text-2xl font-bold text-on-surface mb-2">No Application Found</h2>
          <p className="font-body-md text-on-surface-variant mb-6">You haven't applied for the Ignitte Inductions yet.</p>
          <Link
            to="/apply"
            className="inline-block bg-primary-container text-surface font-label-md text-label-md px-6 py-3 rounded-xl hover:opacity-90 transition-opacity duration-300"
          >
            Apply Now
          </Link>
        </div>
      </div>
    );
  }

  // Determine active timeline steps
  const steps = [
    { key: 'applied', label: 'Applied', icon: 'check', done: true },
    { 
      key: 'demo', 
      label: 'Teaching Demo / Task', 
      icon: 'school', 
      done: application.status !== 'pending',
      active: application.status === 'under-review' || (application.tasks && application.tasks.length > 0)
    },
    { 
      key: 'pi', 
      label: 'Multiple PI Rounds', 
      icon: 'forum', 
      done: application.status === 'accepted' || application.status === 'rejected',
      active: application.currentRound === 'Multiple PI Rounds'
    },
    { 
      key: 'decision', 
      label: 'Decision', 
      icon: 'flag', 
      done: application.status === 'accepted' || application.status === 'rejected',
      active: application.status === 'accepted' || application.status === 'rejected'
    }
  ];

  // Get tasks with feedback
  const feedbackTasks = application.tasks?.filter(t => t.adminFeedback) || [];

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md relative overflow-x-hidden pt-24 pb-16">
      {/* Ambient background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary rounded-full opacity-5 blur-[100px] pointer-events-none"></div>

      <main className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="font-headline-xl text-[36px] font-bold mb-2">
              Welcome Back, <span className="text-primary-container">{user?.fullName}</span>!
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Your journey in JEE mentorship and teaching continues here.
            </p>
          </div>
          <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className={`w-2.5 h-2.5 rounded-full ${application.status === 'accepted' ? 'bg-green-500' : application.status === 'rejected' ? 'bg-error' : 'bg-primary-container animate-pulse'}`}></span>
            <span className="font-label-md text-label-md text-on-surface capitalize">
              Status: {application.status.replace('-', ' ')}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Timeline & Tasks */}
          <div className="lg:col-span-2 space-y-8">
            {/* Progress Tracker Card */}
            <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6">
              <h2 className="font-headline-md text-headline-md mb-8">Evaluation Process</h2>
              <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-2">
                {/* Horizontal line for desktop, vertical for mobile */}
                <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-outline-variant/20 -z-10"></div>
                
                {steps.map((step, idx) => {
                  const isCompleted = step.done;
                  const isActive = step.active && !isCompleted;
                  return (
                    <div key={step.key} className={`relative z-10 flex md:flex-col items-center gap-4 md:gap-2 ${!isCompleted && !isActive ? 'opacity-40' : ''}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-surface transition-all duration-300 ${
                        isCompleted ? 'bg-green-500 text-surface' :
                        isActive ? 'bg-primary-container ring-4 ring-primary-container/20' :
                        'bg-surface-container border border-outline-variant/30 text-on-surface-variant'
                      }`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {isCompleted ? 'check' : step.icon}
                        </span>
                      </div>
                      <span className={`font-label-sm text-label-sm text-center ${isActive ? 'text-primary-container font-semibold' : 'text-on-surface-variant'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tasks Section */}
            <div className="space-y-6">
              <h2 className="font-headline-md text-headline-md flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[24px]">assignment</span>
                Assigned Tasks
              </h2>

              {(!application.tasks || application.tasks.length === 0) ? (
                <div className="bg-surface-container/20 border border-dashed border-outline-variant/25 rounded-2xl p-10 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3">
                    sentiment_satisfied
                  </span>
                  <p className="font-body-md text-on-surface-variant">
                    No tasks assigned yet. Relax and check back later!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {application.tasks.map((task) => (
                    <div 
                      key={task._id} 
                      className={`bg-surface-container/20 backdrop-blur-xl border rounded-2xl p-6 transition-all duration-300 ${
                        task.status === 'pending' ? 'border-primary-container/45' : 'border-outline-variant/20'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-4 mb-4">
                        <div>
                          <h3 className="font-headline-md text-[20px] font-bold mb-1">{task.title}</h3>
                          <p className="font-body-md text-on-surface-variant">{task.description}</p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm border capitalize ${
                          task.status === 'pending' 
                            ? 'bg-primary-container/10 border-primary-container/30 text-primary-container' 
                            : 'bg-green-500/10 border-green-500/30 text-green-400'
                        }`}>
                          {task.status.replace('-', ' ')}
                        </span>
                      </div>

                      {task.status === 'pending' ? (
                        <div className="space-y-4 pt-2 border-t border-outline-variant/10">
                          <div className="space-y-2">
                            <label className="font-label-md text-label-md text-on-surface block">
                              Submission Link (Google Drive / GitHub / YouTube)
                            </label>
                            <div className="relative">
                              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                                link
                              </span>
                              <input
                                type="url"
                                placeholder="Paste your submission link here..."
                                value={submissionLinks[task._id] || ''}
                                onChange={(e) => handleLinkChange(task._id, e.target.value)}
                                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleTaskSubmit(task._id)}
                              disabled={submittingId === task._id}
                              className="bg-primary-container text-surface font-label-md text-label-md px-6 py-3 rounded-xl hover:opacity-95 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {submittingId === task._id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin text-surface" />
                                  Submitting...
                                </>
                              ) : (
                                <>
                                  Submit Task
                                  <span className="material-symbols-outlined text-[16px]">send</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-surface-container-lowest/50 border border-outline-variant/20 rounded-xl p-4 mt-2">
                          <p className="font-label-md text-label-md text-on-surface-variant mb-1">Your Submission:</p>
                          <a 
                            href={task.studentSubmission} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-primary hover:underline font-body-md break-all flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            {task.studentSubmission}
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Feedback Panel */}
          <div className="space-y-8">
            <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 flex flex-col h-full min-h-[400px]">
              <h2 className="font-headline-md text-headline-md mb-6 flex items-center gap-2 border-b border-outline-variant/25 pb-4">
                <span className="material-symbols-outlined text-primary-container text-[24px]">reviews</span>
                Feedback Panel
              </h2>
              
              {feedbackTasks.length === 0 ? (
                <div className="flex-grow flex flex-col justify-center items-center text-center py-12">
                  <span className="material-symbols-outlined text-4xl mb-4 text-on-surface-variant/40">
                    hourglass_empty
                  </span>
                  <p className="font-body-md text-on-surface-variant px-4">
                    No feedback available yet. Once your submitted tasks are reviewed, comments and evaluations will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex-grow space-y-6 overflow-y-auto pr-1">
                  {feedbackTasks.map((task) => (
                    <div key={task._id} className="bg-surface-container-lowest/30 border border-outline-variant/25 rounded-xl p-4 space-y-3">
                      <div>
                        <h4 className="font-label-md text-label-md text-primary-container">{task.title}</h4>
                        <span className="text-xs text-on-surface-variant/60">Reviewed recently</span>
                      </div>
                      <div className="border-t border-outline-variant/10 pt-2">
                        <p className="font-body-md text-on-surface leading-relaxed">
                          "{task.adminFeedback}"
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/10">
                        <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined text-[16px]">person</span>
                        </div>
                        <div>
                          <p className="font-label-sm text-label-sm text-on-surface">Review Team</p>
                          <p className="text-[10px] text-on-surface-variant">Ignitte Evaluators</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;