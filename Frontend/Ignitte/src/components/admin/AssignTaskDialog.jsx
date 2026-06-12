import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAssignTask } from '@/hooks/useAdminQueries';

const AssignTaskDialog = ({ isOpen, onOpenChange, studentApp }) => {
  const [taskData, setTaskData] = useState({ title: '', description: '', round: '' });
  const { toast } = useToast();
  const assignTaskMutation = useAssignTask();

  useEffect(() => {
    if (studentApp) {
      setTaskData({
        title: '',
        description: '',
        round: studentApp.currentRound || 'Application Review'
      });
    }
  }, [studentApp]);

  if (!isOpen) return null;

  const handleAssignTask = () => {
    if (!taskData.title) return;

    assignTaskMutation.mutate(
      { id: studentApp._id, data: taskData },
      {
        onSuccess: () => {
          toast({ title: "Task Assigned", description: `Sent to ${studentApp.user?.fullName || 'student'}` });
          onOpenChange(false);
          setTaskData({ title: '', description: '', round: studentApp.currentRound || 'Application Review' });
        },
        onError: (error) => {
          toast({ title: "Failed", description: error.response?.data?.message || "Could not assign task", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={() => onOpenChange(false)}
      ></div>

      {/* Modal Content */}
      <div className="bg-surface-container/30 backdrop-blur-2xl border border-outline-variant/30 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface p-1 hover:bg-surface-container-lowest/50 rounded-lg transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <h3 className="font-headline-md text-headline-md text-on-surface mb-6">Assign Task</h3>

        <div className="space-y-4 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant">Task Title</label>
            <input
              type="text"
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
              placeholder="e.g. Physics Teaching Demo Video"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant">Round</label>
            <div className="relative">
              <select
                value={taskData.round}
                onChange={(e) => setTaskData({ ...taskData, round: e.target.value })}
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer"
              >
                <option value="Application Review">Application Review</option>
                <option value="PI 1">PI 1</option>
                <option value="PI 2">PI 2</option>
                <option value="PI 3">PI 3</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                expand_more
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-label-md text-on-surface-variant">Instructions</label>
            <textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              rows={4}
              className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30 resize-none"
              placeholder="Provide detailed submission requirements..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="px-5 py-2.5 border border-outline-variant/30 rounded-xl font-label-md text-label-md text-on-surface hover:bg-surface-container-lowest/30 transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignTask}
            disabled={assignTaskMutation.isPending}
            className="px-5 py-2.5 bg-primary-container text-on-primary-container rounded-xl font-label-md text-label-md font-bold shadow-lg hover:shadow-primary-container/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
          >
            {assignTaskMutation.isPending ? "Assigning..." : "Assign Task"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignTaskDialog;
