import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApplications } from '@/hooks/useAdminQueries';

import AdminStats from '@/components/admin/AdminStats';
import ApplicationsTable from '@/components/admin/ApplicationsTable';
import TeamManager from '@/components/admin/TeamManager';
import AssignTaskDialog from '@/components/admin/AssignTaskDialog';
import ViewTasksDialog from '@/components/admin/ViewTasksDialog';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('applications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  
  // Dialog States
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isViewTasksOpen, setIsViewTasksOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  
  // Fetch Applications via React Query
  const { data: applications, isLoading } = useApplications({
    page, 
    limit: 10, 
    search: searchTerm,
    status: statusFilter !== 'all' ? statusFilter : undefined
  });

  // Dialog Handlers
  const openAssignTaskDialog = (studentApp) => {
    setSelectedStudent(studentApp);
    setIsTaskDialogOpen(true);
  };

  const openViewTasksDialog = (studentApp) => {
    setSelectedStudent(studentApp);
    setIsViewTasksOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-body-md relative overflow-x-hidden pt-24 pb-16">
      {/* Ambient background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container rounded-full opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-tertiary rounded-full opacity-5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="font-headline-xl text-[36px] font-bold text-on-surface">Recruitment Command</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">
              Manage applications, evaluate teaching demos, and oversee PI rounds.
            </p>
          </div>
          <div className="bg-surface-container/50 border border-outline-variant/30 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></span>
            <span className="font-label-md text-label-md text-on-surface capitalize">
              Admin: {user?.fullName || "User"}
            </span>
          </div>
        </header>

        {/* Tab Controls */}
        <div className="flex border-b border-outline-variant/20 gap-8">
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-4 font-label-md text-label-md transition-all relative cursor-pointer ${
              activeTab === 'applications' 
                ? 'text-primary-container font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Applications
            {activeTab === 'applications' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`pb-4 font-label-md text-label-md transition-all relative cursor-pointer ${
              activeTab === 'team' 
                ? 'text-primary-container font-semibold' 
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Manage Team
            {activeTab === 'team' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container"></span>
            )}
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'applications' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stats Cards */}
            <AdminStats />

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 p-4 rounded-2xl">
              <div className="relative w-full md:w-96">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
                  search
                </span>
                <input 
                  type="text"
                  placeholder="Search by name or email..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl pl-10 pr-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all placeholder:text-on-surface-variant/30"
                />
              </div>

              <div className="relative w-full md:w-[180px]">
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 py-2.5 font-body-md text-body-md text-on-surface focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="under-review">Under Review</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[20px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Applications Table Card */}
            <div className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 shadow-xl overflow-hidden">
              <h2 className="font-headline-md text-headline-md mb-6">Application Roster</h2>
              <ApplicationsTable 
                applications={applications} 
                isLoading={isLoading}
                openAssignTaskDialog={openAssignTaskDialog}
                openViewTasksDialog={openViewTasksDialog}
              />
            </div>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="animate-in fade-in duration-300">
            <TeamManager />
          </div>
        )}
      </div>

      {selectedStudent && (
        <>
          <AssignTaskDialog 
            isOpen={isTaskDialogOpen} 
            onOpenChange={setIsTaskDialogOpen} 
            studentApp={selectedStudent} 
          />
          <ViewTasksDialog 
            isOpen={isViewTasksOpen} 
            onOpenChange={setIsViewTasksOpen} 
            studentApp={selectedStudent} 
          />
        </>
      )}

    </div>
  );
};

export default AdminDashboard;