import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="text-center">
        <div className="mb-4">
          <Loader className="h-12 w-12 animate-spin text-white mx-auto" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Smart Face Recognition</h1>
        <p className="text-blue-100">Loading dashboard...</p>
      </div>
    </div>
  );
};

export default Index;
