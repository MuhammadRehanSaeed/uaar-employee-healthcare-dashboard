import { useState, useEffect } from "react";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { db } from "../../firebase"; // Adjust if your firebase file is elsewhere
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";

const EmployeeSection = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const snapshot = await getDocs(collection(db, "employees"));
        const data = snapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setEmployees(data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Handle delete
  const handleDelete = async (docId: string) => {
    try {
      await deleteDoc(doc(db, "employees", docId));
      setEmployees(prev => prev.filter(emp => emp.docId !== docId));
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  // Handle update for all fields
  const handleEdit = async (employee: any) => {
    // Prompt for each field to be updated
    const newName = prompt("Enter new name:", employee.name);
    const newDesignation = prompt("Enter new designation:", employee.designation);
    const newEmail = prompt("Enter new email:", employee.email);
    const newEmployeeId = prompt("Enter new employee ID:", employee.employeeId);

    if (newName && newDesignation && newEmail && newEmployeeId) {
      try {
        // Update the Firestore document with the new values
        await updateDoc(doc(db, "employees", employee.docId), { 
          name: newName,
          designation: newDesignation,
          email: newEmail,
          employeeId: newEmployeeId,
        });
        
        // Update the state to reflect changes
        setEmployees(prev =>
          prev.map(emp => 
            emp.docId === employee.docId 
              ? { ...emp, name: newName, designation: newDesignation, email: newEmail, employeeId: newEmployeeId }
              : emp
          )
        );
      } catch (error) {
        console.error("Error updating employee:", error);
      }
    } else {
      alert("All fields must be filled out to update.");
    }
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search employees..." 
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
              <TableHead>Designation</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map((emp: any) => (
                <TableRow key={emp.docId}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell className="font-medium">{emp.name}</TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.employeeId}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(emp)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(emp.docId)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default EmployeeSection;
