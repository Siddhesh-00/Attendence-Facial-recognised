import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatsCards from "@/components/StatsCards";
import AttendanceChart from "@/components/AttendanceChart";
import AttendanceLog from "@/components/AttendanceLog";
import RecentActivity from "@/components/RecentActivity";
import { useSystemInfo } from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Camera, Zap, AlertCircle } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { fetchSystemInfo, info, loading, error } = useSystemInfo();
  const [stats, setStats] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    trainingStatus: "Ready",
  });

  useEffect(() => {
    fetchSystemInfo();
  }, [fetchSystemInfo]);

  useEffect(() => {
    if (info) {
      setStats({
        totalStudents: info.total_students || 0,
        todayAttendance: 0,
        trainingStatus: "Ready",
      });
    }
  }, [info]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500 mt-2">Welcome back to Smart Face Recognition Attendance System</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => navigate("/register")} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Users className="mr-2 h-4 w-4" />
              Register Student
            </Button>
            <Button 
              onClick={() => navigate("/attendance")} 
              className="bg-green-600 hover:bg-green-700"
            >
              <Camera className="mr-2 h-4 w-4" />
              Mark Attendance
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>Error: {error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* System Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className="inline-block w-3 h-3 rounded-full bg-green-500"></span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">API Connection</span>
                    {loading ? (
                      <span className="text-yellow-600">Checking...</span>
                    ) : (
                      <span className="text-green-600">Connected</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Camera</span>
                    <span className="text-blue-600">Ready</span>
                  </div>
                  <Button 
                    onClick={() => navigate("/train")} 
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-700"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Train Encodings
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/students")}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    View All Students
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/attendance")}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Start Attendance
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate("/train")}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Train System
                  </Button>
                </CardContent>
              </Card>

              {/* Information Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-gray-600">
                  <div>
                    <span className="font-semibold">Dataset Path:</span>
                    <p>dataset/</p>
                  </div>
                  <div>
                    <span className="font-semibold">Attendance Report:</span>
                    <p>attendance/attendance.xlsx</p>
                  </div>
                  <div>
                    <span className="font-semibold">Anti-Spoofing:</span>
                    <p>Blink Detection</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AttendanceChart />
              <AttendanceLog />
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <RecentActivity />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
