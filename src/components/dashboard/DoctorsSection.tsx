import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust if needed

const DoctorsSection = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchDoctors = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "doctors"));
      const doctorsData = querySnapshot.docs.map((docSnap) => ({
        firestoreId: docSnap.id,
        ...docSnap.data(),
      }));
      setDoctors(doctorsData);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  };

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "doctors", firestoreId));
      setDoctors(doctors.filter((doc) => doc.firestoreId !== firestoreId));
    } catch (error) {
      console.error("Error deleting doctor:", error);
    }
  };

  const handleEdit = async (doctor: any) => {
    const newName = prompt("Enter new name:", doctor.name);
    const newEmail = prompt("Enter new email:", doctor.email);
    const newDesignation = prompt("Enter new designation:", doctor.designation);
    const newSpecialization = prompt("Enter new specialization:", doctor.specialization);

    if (
      newName &&
      newEmail &&
      newDesignation &&
      newSpecialization &&
      (
        newName !== doctor.name ||
        newEmail !== doctor.email ||
        newDesignation !== doctor.designation ||
        newSpecialization !== doctor.specialization
      )
    ) {
      try {
        await updateDoc(doc(db, "doctors", doctor.firestoreId), {
          name: newName,
          email: newEmail,
          designation: newDesignation,
          specialization: newSpecialization,
        });

        setDoctors(prev =>
          prev.map(d =>
            d.firestoreId === doctor.firestoreId
              ? {
                  ...d,
                  name: newName,
                  email: newEmail,
                  designation: newDesignation,
                  specialization: newSpecialization,
                }
              : d
          )
        );
      } catch (error) {
        console.error("Error updating doctor:", error);
      }
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Doctors Management</h2>
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
              <TableHead>Email</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <TableRow key={doctor.firestoreId}>
                  <TableCell>{doctor.id}</TableCell>
                  <TableCell className="font-medium">{doctor.name}</TableCell>
                  <TableCell>{doctor.specialization}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.designation}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(doctor)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(doctor.firestoreId)}
                    >
                      Delete
                    </Button>
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
