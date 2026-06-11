import { useAdminStats } from '@/hooks/useAdminQueries';

const AdminStats = () => {
  // use adminStats query to fetch the stats of the admin
  // this query is used to display the stats of the admin
  // stats are: total applicants, pending demos, accepted candidates, rejected screening
  const { data: stats, isLoading } = useAdminStats();


  const defaultStats = { total: 0, pending: 0, underReview: 0, accepted: 0, rejected: 0 };
  // if stats is not loaded then show default stats
  const currentStats = stats || defaultStats;

  const statItems = [
    { title: "Total Applicants", value: currentStats.total, icon: "groups", color: "text-primary-container", bg: "bg-primary-container/10" },
    { title: "Pending Demos", value: currentStats.pending, icon: "pending_actions", color: "text-tertiary", bg: "bg-tertiary/10" },
    { title: "Accepted Candidates", value: currentStats.accepted, icon: "check_circle", color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Rejected Screening", value: currentStats.rejected, icon: "cancel", color: "text-error", bg: "bg-error/10" },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
        {statItems.map((_, i) => (
          <div key={i} className="bg-surface-container/20 border border-outline-variant/10 rounded-2xl h-32"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((stat, i) => (
        <div
          key={i}
          className="bg-surface-container/20 backdrop-blur-xl border border-outline-variant/20 rounded-2xl p-6 flex flex-col relative overflow-hidden shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="font-label-md text-label-md text-on-surface-variant">{stat.title}</span>
            <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <span className={`material-symbols-outlined text-[20px] ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
          </div>
          <div className="font-headline-xl text-[32px] font-bold text-on-surface">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminStats;
