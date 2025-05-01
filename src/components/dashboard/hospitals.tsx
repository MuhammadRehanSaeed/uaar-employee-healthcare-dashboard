import { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

const HospitalsSection = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newHospital, setNewHospital] = useState({ name: "", address: "", type: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const snapshot = await getDocs(collection(db, "hospitals"));
        const data = snapshot.docs.map(docSnap => ({
          firestoreId: docSnap.id,
          ...docSnap.data()
        }));
        setHospitals(data);
      } catch (err) {
        console.error("Error fetching hospitals:", err);
      }
    };

    fetchHospitals();
  }, []);

  const handleAddHospital = async () => {
    const { name, address, type } = newHospital;
  

    try {
      const docRef = await addDoc(collection(db, "hospitals"), newHospital);
      setHospitals(prev => [...prev, { ...newHospital, firestoreId: docRef.id }]);
      setNewHospital({ name: "", address: "", type: "" });
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding hospital:", err);
    }
  };

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "hospitals", firestoreId));
      setHospitals(prev => prev.filter(h => h.firestoreId !== firestoreId));
    } catch (err) {
      console.error("Error deleting hospital:", err);
    }
  };

  const handleEdit = async (hospital: any) => {
    const newName = prompt("Edit hospital name:", hospital.name);
    const newAddress = prompt("Edit address:", hospital.address);
    const newType = prompt("Edit type:", hospital.type);

    if (newName && newAddress && newType) {
      try {
        await updateDoc(doc(db, "hospitals", hospital.firestoreId), {
          name: newName,
          address: newAddress,
          type: newType
        });

        setHospitals(prev =>
          prev.map(h =>
            h.firestoreId === hospital.firestoreId
              ? { ...h, name: newName, address: newAddress, type: newType }
              : h
          )
        );
      } catch (err) {
        console.error("Error updating hospital:", err);
      }
    }
  };

  const filteredHospitals = hospitals.filter(h =>
    h.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hospitals Management</h2>
      </div>

      {showAddForm ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <Input
              placeholder="Hospital name"
              value={newHospital.name}
              onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={newHospital.address}
              onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
            />
            <Input
              placeholder="Type (e.g., Punjab Government)"
              value={newHospital.type}
              onChange={(e) => setNewHospital({ ...newHospital, type: e.target.value })}
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={handleAddHospital}>Save</Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
          </div>
        </>
      ) : (
        <Button onClick={() => setShowAddForm(true)}>Add Hospital</Button>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search hospitals..."
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
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <TableRow key={hospital.firestoreId}>
                  <TableCell className="font-medium">{hospital.name}</TableCell>
                  <TableCell>{hospital.address}</TableCell>
                  <TableCell>{hospital.type}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(hospital)}>Edit</Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(hospital.firestoreId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No hospitals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HospitalsSection;
