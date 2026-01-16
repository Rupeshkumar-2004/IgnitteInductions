import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle, Plus } from 'lucide-react';
import { applicationAPI } from '../utils/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplication();
  }, []);

  const fetchApplication = async () => {
    try {
      const response = await applicationAPI.getMyApplication();
      setApplication(response.data.application);
    } catch (error) {
      // No application found
      setApplication(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const getCourseLabel = (code) => {
    const courses = {
      cs: 'Computer Science',
      ba: 'Business Administration',
      eng: 'Engineering',
      health: 'Healthcare',
      arts: 'Arts & Humanities',
      data: 'Data Science',
    };
    return courses[code] || code;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-muted-foreground">
            Track your application status and manage your profile.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold text-foreground">{application ? 1 : 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold text-foreground capitalize">
                    {application?.status || 'No Application'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Step</p>
                  <p className="text-sm font-medium text-foreground">
                    {application?.status === 'approved'
                      ? 'Check email for details'
                      : application?.status === 'rejected'
                      ? 'Contact admissions'
                      : 'Await review'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Details */}
        {application ? (
          <Card className="border-border">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Your Application</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(application.submittedAt).toLocaleDateString()}
                  </CardDescription>
                </div>
                {getStatusBadge(application.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                  <p className="font-medium text-foreground">{application.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <p className="font-medium text-foreground">{application.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Course Applied</p>
                  <p className="font-medium text-foreground">{getCourseLabel(application.course)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Application ID</p>
                  <p className="font-mono text-sm text-foreground">{application.id}</p>
                </div>
              </div>

              {application.status === 'pending' && (
                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-200">Application Under Review</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        Your application is being reviewed by our admissions team. You will receive an email notification once a decision has been made.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {application.status === 'approved' && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-200">Congratulations!</p>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Your application has been approved. Please check your email for further instructions and next steps.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {application.status === 'rejected' && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-start gap-3">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800 dark:text-red-200">Application Not Approved</p>
                      <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                        Unfortunately, your application was not approved at this time. Please contact our admissions office for more information.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Application Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You haven't submitted an application yet. Start your journey by applying for a course today.
              </p>
              <Button asChild size="lg">
                <Link to="/apply">
                  <Plus className="mr-2 h-4 w-4" />
                  Apply Now
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;