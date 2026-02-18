import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStudents } from "@/hooks/useApi";
import { ArrowLeft, UserPlus, Loader, Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Students = () => {
  const navigate = useNavigate();
  const { fetch, students, loading } = useStudents();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch();
  }, [fetch]);

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_number?.toString().includes(searchTerm)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Registered Students</h1>
              <p className="text-gray-500 mt-1">Total: {students.length} students</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Register New
          </Button>
        </div>

        {/* Search Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>All registered students in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  {students.length === 0 ? "No students registered yet" : "No matching students"}
                </p>
                {students.length === 0 && (
                  <Button 
                    onClick={() => navigate("/register")}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Register First Student
                  </Button>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.roll_number}</TableCell>
                      <TableCell>{student.class}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Registered
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        {students.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Total Students</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">{students.length}</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Unique Classes</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {new Set(students.map(s => s.class)).size}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-gray-600 text-sm">Status</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">✅ Ready</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Students;
