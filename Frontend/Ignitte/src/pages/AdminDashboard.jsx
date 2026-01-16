import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button'; // Use alias '@'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Filter, MoreHorizontal, CheckCircle, XCircle, Clock, FileText, PlusCircle } from 'lucide-react';
import { adminAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, underReview: 0, accepted: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // --- NEW STATE FOR TASK ASSIGNMENT ---
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [taskData, setTaskData] = useState({ title: '', description: '' });
  const [isAssigning, setIsAssigning] = useState(false);
  // -------------------------------------

  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, [page, searchTerm, statusFilter]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      const statsRes = await adminAPI.getDashboardStats();
      setStats(statsRes.data.data.stats);

      const params = {
        page,
        limit: 10,
        search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const appsRes = await adminAPI.getAllApplications(params);
      setApplications(appsRes.data.data.applications);
      setTotalPages(appsRes.data.data.pagination.pages);
      
    } catch (error) {
      console.error("Dashboard Error:", error);
      toast({
        title: "Error fetching data",
        description: "Could not load dashboard data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminAPI.updateStatus(id, { status: newStatus });
      toast({ title: "Status Updated", description: `Application marked as ${newStatus}` });
      fetchDashboardData();
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  // --- NEW FUNCTIONS FOR TASKS ---
  const openTaskDialog = (studentApp) => {
    setSelectedStudent(studentApp);
    setTaskData({ title: '', description: '' }); // Reset form
    setIsTaskDialogOpen(true);
  };

  const handleAssignTask = async () => {
    if (!taskData.title) {
        toast({ title: "Title Required", description: "Please enter a task title", variant: "destructive" });
        return;
    }

    setIsAssigning(true);
    try {
        await adminAPI.assignTask(selectedStudent._id, taskData);
        toast({ title: "Task Assigned", description: `Task sent to ${selectedStudent.user.fullName}` });
        setIsTaskDialogOpen(false);
        // Optional: Refresh data if you want to show task count in table
    } catch (error) {
        toast({ 
            title: "Assignment Failed", 
            description: error.response?.data?.message || "Could not assign task", 
            variant: "destructive" 
        });
    } finally {
        setIsAssigning(false);
    }
  };
  // -------------------------------

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      "under-review": "bg-blue-100 text-blue-800"
    };
    return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage applications and assign tasks</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                Admin: {user?.fullName || "User"}
             </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { title: "Total Applications", value: stats.total, icon: FileText, color: "text-blue-600" },
            { title: "Pending Review", value: stats.pending, icon: Clock, color: "text-yellow-600" },
            { title: "Accepted", value: stats.accepted, icon: CheckCircle, color: "text-green-600" },
            { title: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-600" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color} opacity-20`} />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by name or email..." 
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="under-review">Under Review</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>View and manage student applications.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-8">Loading...</TableCell>
                  </TableRow>
                ) : applications.length === 0 ? (
                  <TableRow>
                     <TableCell colSpan={5} className="text-center py-8">No applications found</TableCell>
                  </TableRow>
                ) : (
                  applications.map((app) => (
                    <TableRow key={app._id}>
                      <TableCell>
                        <div className="font-medium">{app.user?.fullName}</div>
                        <div className="text-sm text-muted-foreground">{app.user?.email}</div>
                      </TableCell>
                      <TableCell>{app.course || app.user?.department || 'N/A'}</TableCell>
                      <TableCell>{getStatusBadge(app.status)}</TableCell>
                      <TableCell>{new Date(app.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                            {/* Assign Task Button */}
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => openTaskDialog(app)}
                                className="border-dashed"
                            >
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Assign Task
                            </Button>

                            <Select 
                                defaultValue={app.status} 
                                onValueChange={(val) => handleStatusUpdate(app._id, val)}
                            >
                                <SelectTrigger className="w-[130px] h-8">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="under-review">Under Review</SelectItem>
                                    <SelectItem value="accepted">Accept</SelectItem>
                                    <SelectItem value="rejected">Reject</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination controls can go here */}
          </CardContent>
        </Card>
      </div>

      {/* --- TASK ASSIGNMENT DIALOG --- */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
            <DialogDescription>
              Assign a new task to <strong>{selectedStudent?.user?.fullName}</strong>. They will see this in their dashboard.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task-title">Task Title</Label>
              <Input
                id="task-title"
                placeholder="e.g. Submit GitHub Repository"
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="task-desc">Description / Instructions</Label>
              <Textarea
                id="task-desc"
                placeholder="Enter detailed instructions for the student..."
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTask} disabled={isAssigning}>
              {isAssigning ? "Assigning..." : "Assign Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ----------------------------- */}

    </div>
  );
};

export default AdminDashboard;