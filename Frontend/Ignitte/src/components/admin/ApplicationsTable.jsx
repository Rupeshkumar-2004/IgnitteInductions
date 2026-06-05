import { useUpdateApplicationStatus } from '@/hooks/useAdminQueries';
import { useToast } from '@/hooks/use-toast';

const getStatusBadge = (status) => {
  const styles = {
    approved: "bg-green-500/10 border-green-500/30 text-green-400",
    accepted: "bg-green-500/10 border-green-500/30 text-green-400",
    rejected: "bg-error/10 border-error/30 text-error",
    pending: "bg-primary-container/10 border-primary-container/30 text-primary-container",
    "under-review": "bg-tertiary/10 border-tertiary/30 text-tertiary"
  };
  return (
    <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full font-label-sm text-label-sm border capitalize ${styles[status] || "bg-surface-variant border-outline-variant/30 text-on-surface-variant"}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${
        status === 'accepted' || status === 'approved' ? 'bg-green-400' :
        status === 'rejected' ? 'bg-error' :
        status === 'pending' ? 'bg-primary-container' : 'bg-tertiary'
      }`}></span>
      {status.replace('-', ' ')}
    </span>
  );
};

const ApplicationsTable = ({ applications, isLoading, openViewTasksDialog, openAssignTaskDialog }) => {
  const { toast } = useToast();
  const updateStatusMutation = useUpdateApplicationStatus();

  const handleStatusUpdate = (id, newStatus) => {
    updateStatusMutation.mutate(
      { id, data: { status: newStatus } },
      {
        onSuccess: () => {
          toast({ title: "Status Updated", description: `Marked as ${newStatus}` });
        },
        onError: (error) => {
          toast({ title: "Update Failed", description: error.response?.data?.message || "Failed to update", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="border-b border-outline-variant/20 bg-surface-container-lowest/30">
            <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Candidate Name</th>
            <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Course</th>
            <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Status</th>
            <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Tasks</th> 
            <th className="py-4 px-6 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/10">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-on-surface-variant font-body-md">
                Loading roster...
              </td>
            </tr>
          ) : applications?.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-12 text-on-surface-variant font-body-md">
                No applications found.
              </td>
            </tr>
          ) : applications?.map((app) => (
            <tr key={app._id} className="hover:bg-surface-container/10 transition-colors group">
              <td className="py-4 px-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container flex items-center justify-center font-label-md text-label-md font-bold">
                    {app.user?.fullName?.substring(0, 2).toUpperCase() || 'ST'}
                  </div>
                  <div>
                    <div className="font-body-md text-body-md text-on-surface font-semibold">{app.user?.fullName}</div>
                    <div className="text-xs text-on-surface-variant">{app.user?.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-4 px-6 font-body-md text-body-md text-on-surface-variant">{app.course || 'N/A'}</td>
              <td className="py-4 px-6">{getStatusBadge(app.status)}</td>
              <td className="py-4 px-6">
                <span className="inline-flex items-center bg-surface-container-lowest border border-outline-variant/30 text-on-surface px-3 py-1 rounded-full font-label-sm text-label-sm">
                  {app.tasks?.length || 0} Assigned
                </span>
              </td>
              <td className="py-4 px-6 text-right">
                <div className="flex justify-end items-center gap-3">
                  <button 
                    onClick={() => openViewTasksDialog(app)}
                    title="View Tasks"
                    className="p-2 text-on-surface-variant hover:text-primary-container rounded-lg hover:bg-surface-container-lowest/50 border border-transparent hover:border-outline-variant/30 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </button>
                  <button 
                    onClick={() => openAssignTaskDialog(app)}
                    className="px-4 py-2 border border-outline-variant/30 rounded-lg text-on-surface font-label-sm text-label-sm hover:border-primary-container hover:text-primary-container transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_circle</span>
                    Task
                  </button>
                  
                  <div className="relative">
                    <select 
                      value={app.status} 
                      onChange={(e) => handleStatusUpdate(app._id, e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant/30 rounded-lg pl-3 pr-8 py-2 font-label-sm text-label-sm text-on-surface focus:outline-none focus:border-primary-container transition-all appearance-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="under-review">Under Review</option>
                      <option value="accepted">Accept</option>
                      <option value="rejected">Reject</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[16px]">
                      expand_more
                    </span>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApplicationsTable;
