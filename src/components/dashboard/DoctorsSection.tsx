
import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";

// Mock data
const initialDoctors = [
  { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", yearsOfExperience: 10, status: "Active" },
  { id: 2, name: "Dr. Robert Smith", specialization: "Neurology", yearsOfExperience: 15, status: "Active" },
  { id: 3, name: "Dr. Emily Davis", specialization: "Pediatrics", yearsOfExperience: 8, status: "Active" },
  { id: 4, name: "Dr. Michael Wilson", specialization: "Orthopedics", yearsOfExperience: 12, status: "On Leave" },
  { id: 5, name: "Dr. Jennifer Brown", specialization: "Dermatology", yearsOfExperience: 7, status: "Active" },
];

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState(initialDoctors);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors Management</h2>
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" /> Add Doctor
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search doctors..." 
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Experience (Years)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.id}</TableCell>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.yearsOfExperience}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      doctor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {doctor.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No doctors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DoctorsSection;
