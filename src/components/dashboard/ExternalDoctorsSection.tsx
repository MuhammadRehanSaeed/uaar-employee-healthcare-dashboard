
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
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Plus, Search, UserMinus, UserPlus } from "lucide-react";

// Mock data
const initialExternalDoctors = [
  { id: 1, name: "Dr. James Miller", specialization: "Oncology", hospital: "City Hospital", contactNumber: "+1-555-123-4567" },
  { id: 2, name: "Dr. Patricia Clark", specialization: "Psychiatry", hospital: "Mental Health Institute", contactNumber: "+1-555-234-5678" },
  { id: 3, name: "Dr. John Rodriguez", specialization: "Gastroenterology", hospital: "General Hospital", contactNumber: "+1-555-345-6789" },
  { id: 4, name: "Dr. Elizabeth Taylor", specialization: "Endocrinology", hospital: "Diabetes Center", contactNumber: "+1-555-456-7890" },
];

const ExternalDoctorsSection = () => {
  const [externalDoctors, setExternalDoctors] = useState(initialExternalDoctors);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    hospital: "",
    contactNumber: ""
  });

  const filteredDoctors = externalDoctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = () => {
    // In a real app, you would validate and add to database
    const newId = externalDoctors.length > 0 ? Math.max(...externalDoctors.map(d => d.id)) + 1 : 1;
    const doctorToAdd = {
      id: newId,
      ...newDoctor
    };
    
    setExternalDoctors([...externalDoctors, doctorToAdd]);
    setNewDoctor({ name: "", specialization: "", hospital: "", contactNumber: "" });
    setShowAddForm(false);
  };

  const handleRemoveDoctor = (id: number) => {
    setExternalDoctors(externalDoctors.filter(doctor => doctor.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">External Doctors Management</h2>
        <Button 
          className="flex items-center gap-1"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
          {showAddForm ? "Cancel" : "Add External Doctor"}
        </Button>
      </div>
      
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New External Doctor</CardTitle>
            <CardDescription>Enter the details of the external doctor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Doctor Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  placeholder="Dr. John Doe" 
                  value={newDoctor.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input 
                  id="specialization" 
                  name="specialization"
                  placeholder="Cardiology" 
                  value={newDoctor.specialization}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital/Clinic</Label>
                <Input 
                  id="hospital" 
                  name="hospital"
                  placeholder="City Hospital" 
                  value={newDoctor.hospital}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  name="contactNumber"
                  placeholder="+1-555-123-4567" 
                  value={newDoctor.contactNumber}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button onClick={handleAddDoctor}>Add Doctor</Button>
          </CardFooter>
        </Card>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search external doctors..." 
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
              <TableHead>Hospital/Clinic</TableHead>
              <TableHead>Contact Number</TableHead>
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
                  <TableCell>{doctor.hospital}</TableCell>
                  <TableCell>{doctor.contactNumber}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500"
                      onClick={() => handleRemoveDoctor(doctor.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No external doctors found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExternalDoctorsSection;
