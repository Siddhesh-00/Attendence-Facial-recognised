import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRegistration } from "@/hooks/useApi";
import { ArrowLeft, AlertCircle, CheckCircle, Loader } from "lucide-react";

const Register = () => {
  const navigate = useNavigate();
  const { validate, startCapture, generateEncodings, loading, error } = useRegistration();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    studentClass: "",
  });
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleValidate = async () => {
    setStatus("Validating input...");
    setStatusType("loading");

    if (!formData.name || !formData.rollNumber || !formData.studentClass) {
      setStatus("❌ Please fill all fields");
      setStatusType("error");
      return;
    }

    const result = await validate(formData.name, formData.rollNumber, formData.studentClass);
    
    if (result) {
      setStatus("✅ Validation successful!");
      setStatusType("success");
      setTimeout(() => {
        setStep(2);
        setStatus("");
      }, 1000);
    } else {
      setStatus(`❌ Validation failed: ${error || "Unknown error"}`);
      setStatusType("error");
    }
  };

  const handleCapture = async () => {
    setStatus("📸 Starting face capture...");
    setStatusType("loading");

    const result = await startCapture(formData.name, formData.rollNumber, formData.studentClass);
    
    if (result) {
      setStatus(`${result.message || "Capture completed!"}`);
      setStatusType("success");
      setTimeout(() => {
        setStep(3);
      }, 1500);
    } else {
      setStatus(`❌ Capture failed: ${error || "Unknown error"}`);
      setStatusType("error");
    }
  };

  const handleGenerateEncodings = async () => {
    setStatus("🔧 Generating encodings...");
    setStatusType("loading");

    const result = await generateEncodings(formData.name, formData.rollNumber, formData.studentClass);
    
    if (result && result.success) {
      setStatus(`✅ Registration successful! ${result.message || ""}`);
      setStatusType("success");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      setStatus(`❌ Encoding failed: ${error || "Unknown error"}`);
      setStatusType("error");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Register New Student</h1>
            <p className="text-gray-500 mt-1">Step {step} of 3</p>
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

        {/* Step 1: Student Information */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Student Information</CardTitle>
              <CardDescription>Enter student details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter student name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input
                  id="rollNumber"
                  name="rollNumber"
                  placeholder="Enter roll number"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="studentClass">Class</Label>
                <Input
                  id="studentClass"
                  name="studentClass"
                  placeholder="e.g., 10-A"
                  value={formData.studentClass}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <Button 
                onClick={handleValidate} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Validating...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Face Capture */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Face Capture</CardTitle>
              <CardDescription>We'll now capture your face images</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your webcam will open. Please look directly at the camera and keep your face centered.
                  The system will capture multiple images from different angles.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Camera className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Camera will open when you click the button below</p>
              </div>

              <Button 
                onClick={handleCapture} 
                className="w-full bg-green-600 hover:bg-green-700" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Capturing...
                  </>
                ) : (
                  "Start Face Capture"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Generate Encodings */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Generate Face Encodings</CardTitle>
              <CardDescription>Final step: Process and store face data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="default" className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Face images captured successfully!
                </AlertDescription>
              </Alert>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  The system will now process your images and generate facial encodings for recognition.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleGenerateEncodings} 
                className="w-full" 
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating Encodings...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

import { Camera } from "lucide-react";
export default Register;
