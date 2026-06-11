import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCreateTeamMember, useTeamMembers, useRemoveTeamMember } from '@/hooks/useAdminQueries';
import { useAuth } from '@/hooks/useAuth';

const TeamManager = () => {
  const [teamData, setTeamData] = useState({ fullName: '', email: '', phone: '', department: '', password: '', role: 'interviewer' });
  const { toast } = useToast();
  const createTeamMember = useCreateTeamMember();
  const removeTeamMember = useRemoveTeamMember();
  const { data: teamMembers, isLoading } = useTeamMembers();
  const { user } = useAuth();

  const handleCreateTeamMember = (e) => {
    e.preventDefault();
    createTeamMember.mutate(teamData, {
        onSuccess: () => {
            toast({ title: "Success", description: `New ${teamData.role} created!` });
            setTeamData({ fullName: '', email: '', phone: '', department: '', password: '', role: 'interviewer' });
        },
        onError: (error) => {
            toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
        }
    });
  };

  const handleRemoveMember = (id, name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      removeTeamMember.mutate(id, {
        onSuccess: () => {
          toast({ title: "Removed", description: `${name} has been removed successfully.` });
        },
        onError: (error) => {
          toast({ title: "Error", description: error.response?.data?.message || "Failed to remove member", variant: "destructive" });
        }
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return { datePart: "Never", timePart: "" };
    const date = new Date(dateString);
    const datePart = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
    
    const timePart = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);

    return { datePart, timePart };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
      {/* Create Member Form (Sticky Sidebar on Desktop) */}
      <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
        <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 md:p-8 shadow-xl">
          <div className="mb-6">
            <h2 className="font-headline-md text-headline-md text-on-surface">Add Team Member</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Create Interviewer or Admin accounts to help evaluate candidates.
            </p>
          </div>

          <form onSubmit={handleCreateTeamMember} className="space-y-6">
            <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Role</label>
              <div className="relative">
                <select 
                  value={teamData.role} 
                  onChange={(e) => setTeamData({...teamData, role: e.target.value})}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer"
                >
                  <option value="interviewer">Interviewer</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Full Name</label>
              <input 
                type="text" 
                value={teamData.fullName} 
                onChange={(e) => setTeamData({...teamData, fullName: e.target.value})} 
                required 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
              <input 
                type="email" 
                value={teamData.email} 
                onChange={(e) => setTeamData({...teamData, email: e.target.value})} 
                required 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                placeholder="jane.doe@ignitte.org"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Phone Number</label>
              <input 
                type="tel" 
                value={teamData.phone} 
                onChange={(e) => setTeamData({...teamData, phone: e.target.value})} 
                required 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                placeholder="+91 XXXXX XXXXX"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Department</label>
              <input 
                type="text" 
                value={teamData.department} 
                onChange={(e) => setTeamData({...teamData, department: e.target.value})} 
                required 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                placeholder="e.g. Physics, Chemistry"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Account Password</label>
              <input 
                type="password" 
                value={teamData.password} 
                onChange={(e) => setTeamData({...teamData, password: e.target.value})} 
                required 
                className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={createTeamMember.isPending}
            className="w-full px-6 py-3 bg-primary-container text-on-primary-container rounded-xl font-label-lg text-label-lg font-bold shadow-lg hover:shadow-primary-container/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
          >
            {createTeamMember.isPending ? "Creating Account..." : "Create Member Account"}
          </button>
        </form>
      </div>
      </div>

      {/* Team Members List (Main Content Area) */}
      <div className="lg:col-span-7 xl:col-span-8">
        <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 md:p-8 shadow-xl">
        <div className="mb-6">
          <h2 className="font-headline-md text-headline-md text-on-surface">Current Team Members</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            View active admins and interviewers along with their last login activity.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-on-surface-variant">
            <span className="material-symbols-outlined animate-spin text-3xl">autorenew</span>
            <p className="mt-2 font-label-md text-label-md">Loading team members...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30">
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Name</th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Role</th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Email</th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Last Login</th>
                  <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {teamMembers?.length > 0 ? (
                  teamMembers.map((member) => (
                    <tr key={member._id} className="hover:bg-surface-variant/30 transition-colors">
                      <td className="py-4 px-4">
                        <div className="font-body-md text-body-md text-on-surface font-semibold">
                          {member.fullName}
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant md:hidden mt-1">
                          {member.email}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm capitalize ${
                          member.role === 'admin' 
                            ? 'bg-primary-container text-on-primary-container' 
                            : 'bg-secondary-container text-on-secondary-container'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 hidden md:table-cell font-body-md text-body-md text-on-surface-variant">
                        {member.email}
                      </td>
                      <td className="py-4 px-4 text-right font-body-sm text-body-sm text-on-surface-variant whitespace-nowrap">
                        {member.lastLogin ? (
                          <div className="flex flex-col items-end">
                            <span className="text-on-surface">{formatDate(member.lastLogin).datePart}</span>
                            <span className="text-xs text-on-surface-variant mt-0.5">{formatDate(member.lastLogin).timePart}</span>
                          </div>
                        ) : (
                          <span className="italic text-outline">Never</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        {user?._id !== member._id && (
                          <button
                            onClick={() => handleRemoveMember(member._id, member.fullName)}
                            disabled={removeTeamMember.isPending}
                            className="p-2 text-error hover:bg-error/10 rounded-full transition-colors disabled:opacity-50"
                            title="Remove Member"
                          >
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-on-surface-variant font-body-md">
                      No team members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default TeamManager;
