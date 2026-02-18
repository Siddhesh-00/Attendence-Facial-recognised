import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAttendance } from "@/hooks/useApi";
import { ArrowLeft, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from "lucide-react";

const Attendance = () => {
  const navigate = useNavigate();
  const { start, loading, error } = useAttendance();
  
  const [sessionActive, setSessionActive] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [markedStudents, setMarkedStudents] = useState<string[]>([]);
  const [showLivenessInfo, setShowLivenessInfo] = useState(true);

  const handleStartAttendance = async () => {
    setStatus("📸 Starting attendance session...");
    setStatusType("loading");
    setSessionActive(true);

    const result = await start();
    
    if (result && result.success) {
      setMarkedStudents(result.marked_today || []);
      setStatus(`✅ Session completed! ${result.marked_today?.length || 0} students marked.`);
      setStatusType("success");
      setTimeout(() => {
        setSessionActive(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      }, 2000);
    } else {
      setStatus(`❌ Session failed: ${error || "Unknown error"}`);
      setStatusType("error");
      setSessionActive(false);
    }
  };

  const handleEndSession = () => {
    setSessionActive(false);
    setStatus("");
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/dashboard")}
            disabled={sessionActive}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Mark Attendance</h1>
            <p className="text-gray-500 mt-1">
              {sessionActive ? "Session Active" : "Ready to start"}
            </p>
          </div>
        </div>

        {/* Status Alert */}
        {status && (
          <Alert variant={statusType === "error" ? "destructive" : undefined} className={
            statusType === "success" ? "bg-green-50 border-green-200" : 
            statusType === "loading" ? "bg-blue-50 border-blue-200" : ""
          }>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className={
              statusType === "error" ? "text-red-600" :
              statusType === "success" ? "text-green-600" : "text-blue-600"
            }>
              {status}
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Instructions Card */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Session Instructions</CardTitle>
                <CardDescription>Follow these steps for successful attendance marking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">📋 How It Works:</h3>
                  <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
                    <li>Click "Start Attendance" below</li>
                    <li>Your webcam will open automatically</li>
                    <li>Look directly at the camera and keep your face centered</li>
                    <li>The system will detect your face using anti-spoofing (blink detection)</li>
                    <li>Your attendance will be marked automatically once verified</li>
                    <li>Press ESC or close the camera window to end the session</li>
                  </ol>
                </div>

                {/* Liveness Detection Info */}
                <Card className="bg-amber-50 border-amber-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Anti-Spoofing: Blink Detection</CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowLivenessInfo(!showLivenessInfo)}
                      >
                        {showLivenessInfo ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </CardHeader>
                  {showLivenessInfo && (
                    <CardContent className="space-y-2 text-sm text-amber-900">
                      <p>
                        ✅ <strong>Why this matters:</strong> Prevents fake attendance with photos/videos
                      </p>
                      <p>
                        👁️ <strong>How it works:</strong> System detects natural eye blinks to verify real person
                      </p>
                      <p className="text-xs">
                        💡 <strong>Tip:</strong> Blink naturally while looking at the camera
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Warning */}
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    System requires camera access. Please ensure permissions are granted.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* Camera Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Camera Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
                <div className="text-center">
                  <div className={`inline-block w-4 h-4 rounded-full mb-3 ${
                    sessionActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}></div>
                  <p className="text-sm text-gray-600">
                    {sessionActive ? "Camera Active" : "Ready"}
                  </p>
                </div>
              </div>

              {sessionActive && (
                <div className="space-y-2">
                  <Button
                    onClick={handleEndSession}
                    variant="outline"
                    className="w-full"
                  >
                    Stop Session
                  </Button>
                  <p className="text-xs text-gray-500 text-center">
                    Press ESC in camera window to stop
                  </p>
                </div>
              )}

              {!sessionActive && (
                <Button
                  onClick={handleStartAttendance}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    "📸 Start Attendance"
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Marked Students */}
        {markedStudents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Students Marked ({markedStudents.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {markedStudents.map((student, idx) => (
                  <div key={idx} className="bg-green-50 rounded-lg p-3 text-center border border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-medium text-green-900">{student}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
