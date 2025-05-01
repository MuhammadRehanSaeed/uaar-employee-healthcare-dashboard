import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust path if necessary

const LabsSection = () => {
  const [labs, setLabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newLab, setNewLab] = useState({ name: "", address: "", phone: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "labs"));
        const labsData = querySnapshot.docs.map(docSnap => ({
          firestoreId: docSnap.id,
          ...docSnap.data()
        }));
        setLabs(labsData);
      } catch (error) {
        console.error("Error fetching labs:", error);
      }
    };

    fetchLabs();
  }, []);

  const handleAddLab = async () => {

    try {
      const docRef = await addDoc(collection(db, "labs"), newLab);
      setLabs(prev => [...prev, { ...newLab, firestoreId: docRef.id }]);
      setNewLab({ name: "", address: "", phone: "" });
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding lab:", error);
    }
  };

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "labs", firestoreId));
      setLabs(prev => prev.filter(lab => lab.firestoreId !== firestoreId));
    } catch (error) {
      console.error("Error deleting lab:", error);
    }
  };

  const handleEdit = async (lab: any) => {
    const newName = prompt("Enter new lab name:", lab.name);
    const newAddress = prompt("Enter new address:", lab.address);
    const newPhone = prompt("Enter new phone number:", lab.phone);

    if (
      newName && newAddress && newPhone &&
      (newName !== lab.name || newAddress !== lab.address || newPhone !== lab.phone)
    ) {
      try {
        await updateDoc(doc(db, "labs", lab.firestoreId), {
          name: newName,
          address: newAddress,
          phone: newPhone,
        });

        setLabs(prev =>
          prev.map(l =>
            l.firestoreId === lab.firestoreId
              ? { ...l, name: newName, address: newAddress, phone: newPhone }
              : l
          )
        );
      } catch (error) {
        console.error("Error updating lab:", error);
      }
    }
  };

  const filteredLabs = labs.filter(lab =>
    lab.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lab.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Labs Management</h2>
      </div>

      {showAddForm ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Lab name"
              value={newLab.name}
              onChange={(e) => setNewLab({ ...newLab, name: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={newLab.address}
              onChange={(e) => setNewLab({ ...newLab, address: e.target.value })}
            />
            <Input
              placeholder="Phone number"
              value={newLab.phone}
              onChange={(e) => setNewLab({ ...newLab, phone: e.target.value })}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddLab}>Save</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <Button onClick={() => setShowAddForm(true)}>Add Lab</Button>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search labs..."
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
              <TableHead>Address</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLabs.length > 0 ? (
              filteredLabs.map((lab) => (
                <TableRow key={lab.firestoreId}>
                  <TableCell className="font-medium">{lab.name}</TableCell>
                  <TableCell>{lab.address}</TableCell>
                  <TableCell>{lab.phone}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(lab)}>Edit</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(lab.firestoreId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No labs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default LabsSection;
