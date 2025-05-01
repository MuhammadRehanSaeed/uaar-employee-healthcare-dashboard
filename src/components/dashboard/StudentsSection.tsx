import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust if needed

const StudentsSection = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const studentsData = querySnapshot.docs.map(docSnap => ({
          firestoreId: docSnap.id,
          ...docSnap.data()
        }));
        setStudents(studentsData);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, []);

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "students", firestoreId));
      setStudents(prev => prev.filter(student => student.firestoreId !== firestoreId));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleEdit = async (student: any) => {
    const newName = prompt("Enter new name:", student.name);
    const newEmail = prompt("Enter new email:", student.email);
    const newAridNumber = prompt("Enter new registration number:", student.aridNumber);
    const newDepartment = prompt("Enter new department:", student.department);

    if (
      newName &&
      newEmail &&
      newAridNumber &&
      newDepartment &&
      (
        newName !== student.name ||
        newEmail !== student.email ||
        newAridNumber !== student.aridNumber ||
        newDepartment !== student.department
      )
    ) {
      try {
        await updateDoc(doc(db, "students", student.firestoreId), {
          name: newName,
          email: newEmail,
          aridNumber: newAridNumber,
          department: newDepartment
        });

        setStudents(prev =>
          prev.map(s =>
            s.firestoreId === student.firestoreId
              ? { ...s, name: newName, email: newEmail, aridNumber: newAridNumber, department: newDepartment }
              : s
          )
        );
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  const filteredStudents = students.filter(student =>
    student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.aridNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Students Management</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search students..."
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
              <TableHead>Registration No.</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.firestoreId}>
                  <TableCell>{student.id}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.aridNumber}</TableCell>
                  <TableCell>{student.department}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(student)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(student.firestoreId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StudentsSection;
