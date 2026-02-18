import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTraining, useSystemInfo } from "@/hooks/useApi";
import { ArrowLeft, AlertCircle, CheckCircle, Loader, Zap } from "lucide-react";

const Training = () => {
  const navigate = useNavigate();
  const { train, loading, error } = useTraining();
  const { fetchSystemInfo, info } = useSystemInfo();
  
  const [trainingComplete, setTrainingComplete] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [results, setResults] = useState<any>(null);

  const handleStartTraining = async () => {
    setStatus("🔄 Training in progress...");
    setStatusType("loading");
    setTrainingComplete(false);

    const result = await train();
    
    if (result && result.success) {
      setResults(result);
      setTrainingComplete(true);
      setStatus(`✅ Training completed successfully!`);
      setStatusType("success");
      
      // Refresh system info
      await fetchSystemInfo();
    } else {
      setStatus(`❌ Training failed: ${error || "Unknown error"}`);
      setStatusType("error");
    }
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
            disabled={loading}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Train Face Encodings</h1>
            <p className="text-gray-500 mt-1">Generate facial encodings for recognition</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>What is Training?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 space-y-3">
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">🧠 Face Encoding Generation</h3>
                    <p className="text-sm text-blue-800">
                      The system analyzes all student face images in the dataset folder and creates
                      unique mathematical representations (encodings) of each face. These encodings are
                      used for fast and accurate face recognition during attendance marking.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-2">⚡ When to Train</h3>
                    <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc list-inside">
                      <li>After registering new students</li>
                      <li>If recognition accuracy decreases</li>
                      <li>After adding more face images to dataset</li>
                      <li>Periodically (e.g., monthly) for best results</li>
                    </ul>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Training typically takes 1-5 minutes depending on the number of students and images.
                    Do not interrupt the process.
                  </AlertDescription>
                </Alert>

                {/* Dataset Info */}
                <Card className="bg-gray-50 border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-sm">Dataset Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Students:</span>
                      <span className="font-semibold">{info?.total_students || "Loading..."}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dataset Path:</span>
                      <span className="font-mono text-xs text-gray-600">dataset/</span>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            {/* Results Card */}
            {trainingComplete && results && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-900 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Training Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Total Students</p>
                      <p className="text-2xl font-bold text-green-600">
                        {results.total_students}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-200">
                      <p className="text-xs text-gray-600 mb-1">Encodings Generated</p>
                      <p className="text-2xl font-bold text-green-600">
                        {results.total_encodings}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <p className="text-xs text-gray-600 mb-1">Status</p>
                    <p className="text-sm font-semibold text-green-600">
                      ✅ System ready for attendance marking
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Action Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Start Training</CardTitle>
              <CardDescription>Click below to begin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Zap className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                <p className="text-sm font-medium text-orange-900">Ready to train</p>
              </div>

              <Button
                onClick={handleStartTraining}
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : trainingComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Start Training
                  </>
                )}
              </Button>

              {!loading && !trainingComplete && (
                <p className="text-xs text-gray-500 text-center">
                  This may take a few minutes
                </p>
              )}

              {trainingComplete && (
                <Button
                  onClick={() => navigate("/dashboard")}
                  variant="outline"
                  className="w-full"
                >
                  Back to Dashboard
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">💡 Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✅ Ensure good lighting during student registration</li>
              <li>✅ Capture faces from multiple angles (at least 10 images per student)</li>
              <li>✅ Keep student faces clear and centered in each image</li>
              <li>✅ Train regularly after adding new students</li>
              <li>✅ Avoid extreme angles or shadows in captured images</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Training;
