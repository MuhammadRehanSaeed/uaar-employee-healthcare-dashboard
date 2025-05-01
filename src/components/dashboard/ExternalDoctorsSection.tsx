import { useState, useEffect } from "react";
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
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const ExternalDoctorsSection = () => {
  const [externalDoctors, setExternalDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    hospital: "",
    contactNumber: ""
  });

  // Fetch external doctors from Firestore
  const fetchExternalDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "externalDoctors"));
      const doctorsData = querySnapshot.docs.map(docSnap => ({
        firestoreId: docSnap.id,
        ...docSnap.data()
      }));
      setExternalDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching external doctors:", error);
    }
  };

  useEffect(() => {
    fetchExternalDoctors();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewDoctor(prev => ({ ...prev, [name]: value }));
  };

  const handleAddDoctor = async () => {
    const { name, specialization, hospital, contactNumber } = newDoctor;
    if (!name || !specialization || !hospital || !contactNumber) {
      alert("All fields are required.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "externalDoctors"), newDoctor);
      setExternalDoctors([...externalDoctors, { firestoreId: docRef.id, ...newDoctor }]);
      setNewDoctor({ name: "", specialization: "", hospital: "", contactNumber: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding external doctor:", error);
    }
  };

  const handleRemoveDoctor = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "externalDoctors", firestoreId));
      setExternalDoctors(externalDoctors.filter(doctor => doctor.firestoreId !== firestoreId));
    } catch (error) {
      console.error("Error deleting external doctor:", error);
    }
  };

  const filteredDoctors = externalDoctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
                <TableRow key={doctor.firestoreId}>
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
                      onClick={() => handleRemoveDoctor(doctor.firestoreId)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
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
