import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, CheckCircle, XCircle, Clock, FileText, PlusCircle, Eye, ExternalLink, ThumbsUp, ThumbsDown, RotateCcw } from 'lucide-react';
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
  
  // Dialog States
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isViewTasksOpen, setIsViewTasksOpen] = useState(false);
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [taskData, setTaskData] = useState({ title: '', description: '' });
  const [teamData, setTeamData] = useState({ fullName: '', email: '', phone: '', department: '', password: '', role: 'interviewer' });
  const [isAssigning, setIsAssigning] = useState(false);
  
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
        page, limit: 10, search: searchTerm,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };
      
      const appsRes = await adminAPI.getAllApplications(params);
      setApplications(appsRes.data.data.applications);
      
    } catch (error) {
      toast({ title: "Error", description: "Could not load data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await adminAPI.updateStatus(id, { status: newStatus });
      toast({ title: "Status Updated", description: `Marked as ${newStatus}` });
      fetchDashboardData();
    } catch (error) {
      toast({ title: "Update Failed", variant: "destructive" });
    }
  };

  // --- TASK LOGIC ---
  const openAssignTaskDialog = (studentApp) => {
    setSelectedStudent(studentApp);
    setTaskData({ title: '', description: '' }); 
    setIsTaskDialogOpen(true);
  };

  const handleAssignTask = async () => {
    if (!taskData.title) return;
    setIsAssigning(true);
    try {
        await adminAPI.assignTask(selectedStudent._id, taskData);
        toast({ title: "Task Assigned", description: `Sent to ${selectedStudent.user.fullName}` });
        setIsTaskDialogOpen(false);
        fetchDashboardData();
    } catch (error) {
        toast({ title: "Failed", description: "Could not assign task", variant: "destructive" });
    } finally {
        setIsAssigning(false);
    }
  };

  const openViewTasksDialog = (studentApp) => {
    setSelectedStudent(studentApp);
    setIsViewTasksOpen(true);
  };

  // Verify/Reject Logic
  const handleVerifyTask = async (taskId, status, feedback = "") => {
    try {
        await adminAPI.verifyTask(selectedStudent._id, taskId, { status, feedback });
        toast({ title: `Task ${status}`, description: "Status updated successfully." });
        
        // Refresh local student data
        const updatedApps = applications.map(app => {
            if (app._id === selectedStudent._id) {
                const newTasks = app.tasks.map(t => {
                   if (t._id === taskId) {
                       // Update verifier info locally
                       const verifier = status === 'verified' ? { fullName: user.fullName, _id: user._id, email: user.email } : null;
                       return { ...t, status, verifiedBy: verifier };
                   }
                   return t;
                });
                
                const updatedStudent = { ...app, tasks: newTasks };
                setSelectedStudent(updatedStudent);
                return updatedStudent;
            }
            return app;
        });
        setApplications(updatedApps);

    } catch (error) {
        console.error(error);
        toast({ title: "Error", description: error.response?.data?.message || "Could not update task", variant: "destructive" });
    }
  };

  // --- TEAM CREATION ---
  const handleCreateTeamMember = async (e) => {
    e.preventDefault();
    try {
        await adminAPI.createTeamMember(teamData);
        toast({ title: "Success", description: `New ${teamData.role} created!` });
        setTeamData({ fullName: '', email: '', phone: '', department: '', password: '', role: 'interviewer' });
    } catch (error) {
        toast({ title: "Error", description: error.response?.data?.message || "Failed", variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      approved: "bg-green-100 text-green-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      "under-review": "bg-blue-100 text-blue-800"
    };
    return <Badge className={styles[status] || "bg-gray-100"}>{status}</Badge>;
  };

  // --- IMPROVED: Check Permissions & State ---
  const canManageTask = (task) => {
      // 1. If it's submitted, always allow action
      if (task.status === 'submitted') return true;

      // 2. If it's verified, check restricted permissions
      if (task.status === 'verified') {
          const superAdmins = ['admin@clubinduction.com', 'admin@inductions'];
          const isSuperAdmin = superAdmins.includes(user?.email);
          const verifierId = task.verifiedBy?._id || task.verifiedBy;
          const isVerifier = verifierId === user?._id;
          return isSuperAdmin || isVerifier;
      }

      // 3. FIX: If it's pending but has a submission, allow action (This fixes your issue)
      if (task.status === 'pending' && task.studentSubmission) return true;

      // 4. If it's rejected, allow action (to undo rejection)
      if (task.status === 'rejected') return true;

      return false;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage applications, tasks, and team members</p>
          </div>
          <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
             Admin: {user?.fullName || "User"}
          </div>
        </div>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="team">Manage Team</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-8 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: "Total", value: stats.total, icon: FileText, color: "text-blue-600" },
                { title: "Pending", value: stats.pending, icon: Clock, color: "text-yellow-600" },
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

            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search name/email..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="under-review">Under Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader><CardTitle>Applications</CardTitle></CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tasks</TableHead> 
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
                    ) : applications.map((app) => (
                      <TableRow key={app._id}>
                        <TableCell>
                          <div className="font-medium">{app.user?.fullName}</div>
                          <div className="text-sm text-muted-foreground">{app.user?.email}</div>
                        </TableCell>
                        <TableCell>{app.course || 'N/A'}</TableCell>
                        <TableCell>{getStatusBadge(app.status)}</TableCell>
                        <TableCell>
                            <Badge variant="outline">{app.tasks?.length || 0} Assigned</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => openViewTasksDialog(app)}>
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => openAssignTaskDialog(app)}>
                                  <PlusCircle className="mr-2 h-4 w-4" /> Task
                              </Button>
                              <Select defaultValue={app.status} onValueChange={(val) => handleStatusUpdate(app._id, val)}>
                                  <SelectTrigger className="w-[130px] h-8"><SelectValue /></SelectTrigger>
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
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Team Member</CardTitle>
                <CardDescription>Create Admins or Interviewers.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTeamMember} className="space-y-4 max-w-lg">
                  <div className="grid gap-2">
                      <Label>Role</Label>
                      <Select value={teamData.role} onValueChange={(val) => setTeamData({...teamData, role: val})}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                              <SelectItem value="interviewer">Interviewer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                      </Select>
                  </div>
                  <div className="grid gap-2"><Label>Name</Label><Input value={teamData.fullName} onChange={(e) => setTeamData({...teamData, fullName: e.target.value})} required /></div>
                  <div className="grid gap-2"><Label>Email</Label><Input value={teamData.email} onChange={(e) => setTeamData({...teamData, email: e.target.value})} required /></div>
                  <div className="grid gap-2"><Label>Phone</Label><Input value={teamData.phone} onChange={(e) => setTeamData({...teamData, phone: e.target.value})} required /></div>
                  <div className="grid gap-2"><Label>Department</Label><Input value={teamData.department} onChange={(e) => setTeamData({...teamData, department: e.target.value})} required /></div>
                  <div className="grid gap-2"><Label>Password</Label><Input value={teamData.password} onChange={(e) => setTeamData({...teamData, password: e.target.value})} required /></div>
                  <Button type="submit">Create Account</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Task</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Title</Label><Input value={taskData.title} onChange={(e) => setTaskData({...taskData, title: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Instructions</Label><Textarea value={taskData.description} onChange={(e) => setTaskData({...taskData, description: e.target.value})} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAssignTask} disabled={isAssigning}>Assign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewTasksOpen} onOpenChange={setIsViewTasksOpen}>
        <DialogContent className="max-w-2xl">
            <DialogHeader>
                <DialogTitle>Task Submissions for {selectedStudent?.user?.fullName}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {(!selectedStudent?.tasks?.length) ? (
                    <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">No tasks.</div>
                ) : (
                    selectedStudent.tasks.map((task, index) => (
                        <div key={index} className="border rounded-lg p-4 bg-card shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-bold">{task.title}</h4>
                                    <p className="text-sm text-muted-foreground">{task.description}</p>
                                </div>
                                <Badge variant={task.status === 'verified' ? 'default' : 'outline'}>{task.status}</Badge>
                            </div>
                            
                            <div className="mt-4 pt-4 border-t flex items-center justify-between">
                                <div className="text-sm">
                                    <span className="font-semibold text-muted-foreground">Submission: </span>
                                    {task.studentSubmission ? (
                                        <a href={task.studentSubmission} target="_blank" rel="noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                            {task.studentSubmission} <ExternalLink className="h-3 w-3" />
                                        </a>
                                    ) : <span className="text-yellow-600 italic">Pending...</span>}
                                </div>
                                
                                <div className="flex flex-col items-end gap-2">
                                    <div className="text-xs text-muted-foreground">
                                        Assigned: {new Date(task.createdAt).toLocaleDateString()}
                                    </div>
                                    
                                    {task.verifiedBy && (
                                        <div className="text-xs text-green-600 font-medium">
                                            Reviewed by: {task.verifiedBy.fullName || task.verifiedBy.email || "Admin"}
                                        </div>
                                    )}

                                    {/* --- BUTTONS LOGIC --- */}
                                    {canManageTask(task) && (
                                        <div className="flex gap-2 mt-1">
                                            {/* Show Verify button if it's NOT verified yet */}
                                            {task.status !== 'verified' && (
                                                <>
                                                    <Button size="xs" variant="outline" className="h-7 text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleVerifyTask(task._id, 'verified')}>
                                                        <ThumbsUp className="h-3 w-3 mr-1" /> Verify
                                                    </Button>
                                                    <Button size="xs" variant="outline" className="h-7 text-red-600 border-red-200 hover:bg-red-50" onClick={() => handleVerifyTask(task._id, 'rejected')}>
                                                        <ThumbsDown className="h-3 w-3 mr-1" /> Reject
                                                    </Button>
                                                </>
                                            )}
                                            
                                            {/* Show UNVERIFY/RESET button if it IS verified */}
                                            {/* Updated to set status to 'submitted' instead of 'pending' so it stays visible as needing review */}
                                            {task.status === 'verified' && (
                                                <Button size="xs" variant="outline" className="h-7 text-yellow-600 border-yellow-200 hover:bg-yellow-50" onClick={() => handleVerifyTask(task._id, 'submitted')}>
                                                    <RotateCcw className="h-3 w-3 mr-1" /> Mark Unverified
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <DialogFooter><Button onClick={() => setIsViewTasksOpen(false)}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default AdminDashboard;