import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus, ExternalLink, ChevronRight } from 'lucide-react';
import { applicationAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Task Submission State
  const [submissionLink, setSubmissionLink] = useState('');
  const [submittingId, setSubmittingId] = useState(null);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await applicationAPI.getMyApplication();
      setApplication(response.data.data); // Adjust based on your API wrapper
    } catch (error) {
      setApplication(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskSubmit = async (taskId) => {
    if (!submissionLink) return;
    
    setSubmittingId(taskId);
    try {
        await applicationAPI.submitTask(taskId, submissionLink);
        toast({ title: "Task Submitted", description: "Your work has been sent for review." });
        setSubmissionLink('');
        fetchApplication(); // Refresh to show updated status
    } catch (error) {
        toast({ title: "Error", description: "Could not submit task", variant: "destructive" });
    } finally {
        setSubmittingId(null);
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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // ... (Keep the "No Application" view from before if application is null) ...
  if (!application) {
      return (
          <div className="min-h-screen flex items-center justify-center">
             <div className="text-center">
                <h2 className="text-2xl font-bold">No Application Found</h2>
                <Button asChild className="mt-4"><Link to="/apply">Apply Now</Link></Button>
             </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-5xl space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.fullName}</p>
        </div>

        {/* Application Status Card */}
        <Card>
            <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>Application Status</CardTitle>
                        <CardDescription>Applied for {application.course || "Course"}</CardDescription>
                    </div>
                    {getStatusBadge(application.status)}
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Applied: {new Date(application.createdAt).toLocaleDateString()}
                    </div>
                    {/* Show current round if it exists */}
                    {application.currentRound && (
                         <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            Current Stage: <span className="text-foreground font-medium">{application.currentRound}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>

        {/* --- TASKS SECTION --- */}
        <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Assigned Tasks
            </h2>
            
            {(!application.tasks || application.tasks.length === 0) ? (
                <Card className="bg-muted/50 border-dashed">
                    <CardContent className="py-8 text-center text-muted-foreground">
                        No tasks assigned yet. Relax and check back later!
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {application.tasks.map((task) => (
                        <Card key={task._id} className={task.status === 'pending' ? 'border-primary/50' : ''}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{task.title}</CardTitle>
                                        <CardDescription className="mt-1">{task.description}</CardDescription>
                                    </div>
                                    <Badge variant={task.status === 'pending' ? 'outline' : 'secondary'}>
                                        {task.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {task.status === 'pending' ? (
                                    <div className="flex gap-2 items-end">
                                        <div className="grid w-full gap-1.5">
                                            <label className="text-sm font-medium">Submission Link / Answer</label>
                                            <Input 
                                                placeholder="Paste your Google Drive or GitHub link here..." 
                                                value={submissionLink}
                                                onChange={(e) => setSubmissionLink(e.target.value)}
                                            />
                                        </div>
                                        <Button 
                                            onClick={() => handleTaskSubmit(task._id)}
                                            disabled={submittingId === task._id}
                                        >
                                            {submittingId === task._id ? "Sending..." : "Submit"}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="bg-muted p-3 rounded-md text-sm">
                                        <span className="font-semibold">You Submitted: </span>
                                        <a href={task.studentSubmission} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate inline-block max-w-[300px] align-bottom">
                                            {task.studentSubmission}
                                        </a>
                                        {task.adminFeedback && (
                                            <div className="mt-2 pt-2 border-t border-border">
                                                <span className="font-semibold text-yellow-600">Feedback: </span>
                                                {task.adminFeedback}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
        {/* --------------------- */}

      </div>
    </div>
  );
};

export default StudentDashboard;