import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useVerifyTask } from '@/hooks/useAdminQueries';

const ViewTasksDialog = ({ isOpen, onOpenChange, studentApp }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const verifyTaskMutation = useVerifyTask();

  if (!isOpen) return null;

  const handleVerifyTask = (taskId, status) => {
    verifyTaskMutation.mutate(
      { appId: studentApp._id, taskId, data: { status, feedback: "" } },
      {
        onSuccess: () => {
          toast({ title: `Task ${status}`, description: "Status updated successfully." });
        },
        onError: (error) => {
          toast({ title: "Error", description: error.response?.data?.message || "Could not update task", variant: "destructive" });
        }
      }
    );
  };

  const canManageTask = (task) => {
    if (task.status === 'submitted') return true;
    if (task.status === 'verified') {
        const superAdmins = ['admin@clubinduction.com', 'admin@inductions'];
        const isSuperAdmin = superAdmins.includes(user?.email);
        const verifierId = task.verifiedBy?._id || task.verifiedBy;
        const isVerifier = verifierId === user?._id;
        return isSuperAdmin || isVerifier;
    }
    if (task.status === 'pending' && task.studentSubmission) return true;
    if (task.status === 'rejected') return true;
    return false;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 cursor-pointer" 
        onClick={() => onOpenChange(false)}
      ></div>
      
      {/* Modal Content */}
      <div className="bg-surface-container/30 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl p-6 w-full max-w-2xl shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button 
          onClick={() => onOpenChange(false)} 
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 hover:bg-surface-container-lowest/50 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <h3 className="font-headline-md text-headline-md text-on-surface mb-6">
          Task Submissions for {studentApp?.user?.fullName}
        </h3>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 mb-6 scrollbar-thin">
            {(!studentApp?.tasks?.length) ? (
                <div className="text-center py-12 text-on-surface-variant bg-surface-container-lowest/30 border border-dashed border-outline-variant/30 rounded-xl">
                  <span className="material-symbols-outlined text-[36px] text-on-surface-variant/30 mb-2 block">assignment</span>
                  No tasks assigned to this candidate yet.
                </div>
            ) : (
                studentApp.tasks.map((task, index) => (
                    <div key={index} className="border border-outline-variant/20 rounded-xl p-5 bg-surface-container-lowest/20 flex flex-col gap-4">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h4 className="font-title-md text-title-md text-on-surface font-semibold">{task.title}</h4>
                                <p className="font-body-md text-body-md text-on-surface-variant mt-1">{task.description}</p>
                            </div>
                            <span className={`inline-flex items-center gap-1 py-1 px-3 rounded-full font-label-sm text-label-sm border capitalize ${
                              task.status === 'verified' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                              task.status === 'rejected' ? 'bg-error/10 border-error/30 text-error' :
                              task.status === 'submitted' ? 'bg-tertiary/10 border-tertiary/30 text-tertiary' :
                              'bg-surface-variant border-outline-variant/30 text-on-surface-variant'
                            }`}>
                              {task.status}
                            </span>
                        </div>
                        
                        <div className="pt-4 border-t border-outline-variant/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="font-body-md text-body-md">
                                <span className="font-semibold text-on-surface-variant">Submission: </span>
                                {task.studentSubmission ? (
                                    <a 
                                      href={task.studentSubmission} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-primary-container hover:underline inline-flex items-center gap-1.5"
                                    >
                                        View Resource <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                                    </a>
                                ) : <span className="text-yellow-500 italic">No submission yet</span>}
                            </div>
                            
                            <div className="flex flex-col items-end gap-2">
                                <div className="text-xs text-on-surface-variant">
                                    Assigned: {new Date(task.createdAt).toLocaleDateString()}
                                </div>
                                
                                {task.verifiedBy && (
                                    <div className="text-xs text-green-400 font-medium">
                                        Reviewed by: {task.verifiedBy.fullName || task.verifiedBy.email || "Admin"}
                                    </div>
                                )}

                                {canManageTask(task) && (
                                    <div className="flex gap-2 mt-1">
                                        {task.status !== 'verified' && (
                                            <>
                                                <button 
                                                  onClick={() => handleVerifyTask(task._id, 'verified')}
                                                  className="px-3 py-1.5 border border-green-500/30 rounded-lg text-green-400 hover:bg-green-500/10 text-xs font-label-sm transition-all flex items-center gap-1 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">thumb_up</span> Verify
                                                </button>
                                                <button 
                                                  onClick={() => handleVerifyTask(task._id, 'rejected')}
                                                  className="px-3 py-1.5 border border-error/30 rounded-lg text-error hover:bg-error/10 text-xs font-label-sm transition-all flex items-center gap-1 cursor-pointer"
                                                >
                                                    <span className="material-symbols-outlined text-[14px]">thumb_down</span> Reject
                                                </button>
                                            </>
                                        )}
                                        
                                        {task.status === 'verified' && (
                                            <button 
                                              onClick={() => handleVerifyTask(task._id, 'submitted')}
                                              className="px-3 py-1.5 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:text-on-surface text-xs font-label-sm transition-all flex items-center gap-1 cursor-pointer"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">undo</span> Mark Unverified
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>

        <div className="flex justify-end">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-6 py-2.5 bg-surface-container-lowest text-on-surface border border-outline-variant/30 rounded-xl font-label-md text-label-md transition-all hover:bg-surface-container-lowest/70 cursor-pointer"
          >
            Close Dialog
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTasksDialog;
