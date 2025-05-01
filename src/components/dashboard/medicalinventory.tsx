import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

const MedicalInventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMedicine, setNewMedicine] = useState({ name: "", quantity: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "medicineinventory"));
        const medicineData = querySnapshot.docs.map(docSnap => ({
          firestoreId: docSnap.id,
          ...docSnap.data()
        }));
        setMedicines(medicineData);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    fetchMedicines();
  }, []);

  const handleDelete = async (firestoreId: string) => {
    try {
      await deleteDoc(doc(db, "medicineinventory", firestoreId));
      setMedicines(prev => prev.filter(med => med.firestoreId !== firestoreId));
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, quantity } = newMedicine;

    if (!name.trim() || isNaN(Number(quantity)) || Number(quantity) < 0) return;

    try {
      if (editingId) {
        await updateDoc(doc(db, "medicineinventory", editingId), {
          name,
          quantity: parseInt(quantity),
        });
        setMedicines(prev =>
          prev.map(m =>
            m.firestoreId === editingId
              ? { ...m, name, quantity: parseInt(quantity) }
              : m
          )
        );
      } else {
        const docRef = await addDoc(collection(db, "medicineinventory"), {
          name,
          quantity: parseInt(quantity),
        });
        setMedicines(prev => [
          ...prev,
          { firestoreId: docRef.id, name, quantity: parseInt(quantity) },
        ]);
      }
      setNewMedicine({ name: "", quantity: "" });
      setIsAdding(false);
      setEditingId(null);
    } catch (error) {
      console.error("Error saving medicine:", error);
    }
  };

  const handleEdit = (medicine: any) => {
    setNewMedicine({ name: medicine.name, quantity: medicine.quantity.toString() });
    setEditingId(medicine.firestoreId);
    setIsAdding(true);
  };

  const filteredMedicines = medicines.filter(med =>
    med.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Medical Inventory</h2>
        <Button onClick={() => {
          setIsAdding(prev => !prev);
          setEditingId(null);
          setNewMedicine({ name: "", quantity: "" });
        }}>
          {isAdding ? "Cancel" : "Add Medicine"}
        </Button>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="space-y-2 border p-4 rounded-md">
          <div className="flex gap-4">
            <Input
              placeholder="Medicine name"
              value={newMedicine.name}
              onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            />
            <Input
              placeholder="Quantity"
              type="number"
              min="0"
              value={newMedicine.quantity}
              onChange={(e) => setNewMedicine({ ...newMedicine, quantity: e.target.value })}
            />
            <Button type="submit">{editingId ? "Update" : "Add"}</Button>
          </div>
        </form>
      )}

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search medicines..."
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
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map((medicine) => (
                <TableRow key={medicine.firestoreId}>
                  <TableCell className="font-medium">{medicine.name}</TableCell>
                  <TableCell>{medicine.quantity}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(medicine)}>
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500"
                      onClick={() => handleDelete(medicine.firestoreId)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No medicines found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MedicalInventory;
