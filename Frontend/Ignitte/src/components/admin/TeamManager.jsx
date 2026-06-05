import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useCreateTeamMember } from '@/hooks/useAdminQueries';

const TeamManager = () => {
  const [teamData, setTeamData] = useState({ fullName: '', email: '', phone: '', department: '', password: '', role: 'interviewer' });
  const { toast } = useToast();
  const createTeamMember = useCreateTeamMember();

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

  return (
    <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl">
      <div className="mb-6">
        <h2 className="font-headline-md text-headline-md text-on-surface">Add Team Member</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Create Interviewer or Admin accounts to help evaluate candidates.
        </p>
      </div>

      <form onSubmit={handleCreateTeamMember} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          className="w-full md:w-auto px-6 py-3 bg-primary-container text-on-primary-container rounded-xl font-label-lg text-label-lg font-bold shadow-lg hover:shadow-primary-container/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none cursor-pointer"
        >
          {createTeamMember.isPending ? "Creating Account..." : "Create Member Account"}
        </button>
      </form>
    </div>
  );
};

export default TeamManager;
