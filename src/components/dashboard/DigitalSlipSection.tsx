"use client";

import { useState,useEffect ,useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Printer } from "lucide-react";
import { db } from "../../firebase"; // Adjust if your firebase file is elsewhere

import { collection, addDoc, getDocs,updateDoc, doc,serverTimestamp } from "firebase/firestore";

const DigitalSlipSection = () => {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientType, setPatientType] = useState("student");
  const [doctor, setDoctor] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medication, setMedication] = useState("");
  const [medicineQuantity, setMedicineQuantity] = useState(1); 
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [treatment, setTreatment] = useState("");
  const [test, setTest] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]); // Stores fetched medicines
  const [selectedMedicine, setSelectedMedicine] = useState("");


  const slipRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const fetchMedicines = async () => {
      const medicinesCollection = collection(db, "medicineinventory");
      const medicineSnapshot = await getDocs(medicinesCollection);
      const medicineList = medicineSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMedicines(medicineList);
    };

    fetchMedicines();
  }, []);
  

  const handlePrint = () => {
    if (slipRef.current) {
      const printContents = slipRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = `
        <div style="padding: 20px;">
          <div style="max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 20px;">
            ${printContents}
          </div>
        </div>
      `;

      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleSendSlip = async () => {
    if (!patientId || !patientName) {
      alert("Patient ID and Name are required.");
      return;
    }

    

    try {

      const selectedMedicineDoc = medicines.find((medicine) => medicine.name === selectedMedicine);
      if (selectedMedicineDoc) {
        const medicineRef = doc(db, "medicineinventory", selectedMedicineDoc.id);
        const newQuantity = selectedMedicineDoc.quantity - medicineQuantity;
        
        // Ensure quantity is not negative
        if (newQuantity >= 0) {
          await updateDoc(medicineRef, { quantity: newQuantity });
        } else {
          alert("Not enough stock available.");
          return;
        }
      }
      await addDoc(collection(db, "medicalSlips"), {
        patientId,
        patientName,
        patientAge,
        patientType,
        doctor,
        diagnosis,
        medication,
        date,
        validTill,
        treatment,
        test,
        prescribedMedicine: selectedMedicine, // Add prescribed medicine
        prescribedMedicineQuantity: medicineQuantity, // 
        createdAt: serverTimestamp(),
      });
      alert("Medical slip sent successfully!");
    } catch (error) {
      console.error("Error sending slip:", error);
      alert("Failed to send slip. Please try again.");
    }
  };

  // Calculate "Valid Till" date (1 month later)
  const validTillDate = new Date(date);
  validTillDate.setMonth(validTillDate.getMonth() + 1);
  const validTill = validTillDate.toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Digital Medical Slip</h2>
        <div className="flex gap-2">
          <Button
            onClick={handleSendSlip}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Send Slip
          </Button>
          <Button onClick={handlePrint} className="flex items-center gap-1">
            <Printer className="h-4 w-4" /> Print Slip
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Card - Patient Form */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>
              Enter the patient details to generate a medical slip
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Patient Name</Label>
                <Input
                  id="patientName"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientId">Patient ID</Label>
                <Input
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="P12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientAge">Age</Label>
                <Input
                  id="patientAge"
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="patientType">Patient Type</Label>
                <Select value={patientType} onValueChange={setPatientType}>
                  <SelectTrigger id="patientType">
                    <SelectValue placeholder="Select patient type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="employee">Employee</SelectItem>
                    <SelectItem value="external">External</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input
                  id="doctor"
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  placeholder="Dr. Smith"
                />
              </div>
            </div>
            <div className="space-y-2">
               {/* Medicine Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="medicine">Select Medicine</Label>
              <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                <SelectTrigger id="medicine">
                  <SelectValue placeholder="Select a medicine" />
                </SelectTrigger>
                <SelectContent>
                  {medicines.map((medicine) => (
                    <SelectItem key={medicine.id} value={medicine.name}>
                      {medicine.name} - {medicine.quantity} in stock
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Medicine Quantity Input */}
            <div className="space-y-2">
              <Label htmlFor="medicineQuantity">Quantity Prescribed</Label>
              <Input
                id="medicineQuantity"
                type="number"
                value={medicineQuantity}
                onChange={(e) => setMedicineQuantity(Number(e.target.value))}
                min="1"
                max="100"
              />
            </div>
  <Label htmlFor="treatment">Treatment</Label>
  <Input
    id="treatment"
    value={treatment}
    onChange={(e) => setTreatment(e.target.value)}
    placeholder="e.g., Physiotherapy, Bed Rest"
  />
</div>

<div className ="space-y-2">
  <Label htmlFor="test">Test</Label>
  <Input
    id="test"
    value={test}
    onChange={(e) => setTest(e.target.value)}
    placeholder="e.g., Blood Test, X-Ray"
  />
</div>


            <div className="space-y-2">
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea
                id="diagnosis"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="Patient diagnosis..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="medication">Medication & Instructions</Label>
              <Textarea
                id="medication"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
                placeholder="Prescribed medication and instructions..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

      {/* Right Card - Preview */}
<Card>
  <CardHeader>
    <CardTitle>Medical Slip Preview</CardTitle>
    <CardDescription>Live preview of the medical slip</CardDescription>
  </CardHeader>
  <CardContent>
    <div
      ref={slipRef}
      className="border p-6 rounded-md bg-white min-h-[500px]"
    >
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-primary">UAAR Healthcare Center</h2>
        <p className="text-gray-500">Medical Slip</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Patient Name</p>
          <p className="font-medium">{patientName || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Patient ID</p>
          <p className="font-medium">{patientId || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Age</p>
          <p className="font-medium">{patientAge || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Patient Type</p>
          <p className="font-medium capitalize">{patientType || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium">{date || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Valid Till</p>
          <p className="font-medium">{validTill || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Doctor</p>
          <p className="font-medium">{doctor || "N/A"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Medicine</p>
          <div className="border p-3 rounded min-h-[60px]">
            {selectedMedicine || "N/A"}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Quantity</p>
          <div className="border p-3 rounded min-h-[60px]">
            {medicineQuantity || "N/A"}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-500 mb-1">Treatment</p>
          <div className="border p-3 rounded min-h-[60px]">
            {treatment || "No treatment provided"}
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 mb-1">Test</p>
          <div className="border p-3 rounded min-h-[60px]">
            {test || "No tests required"}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
        <div className="border p-3 rounded min-h-[80px]">
          {diagnosis || "No diagnosis provided"}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Medication & Instructions</p>
        <div className="border p-3 rounded min-h-[100px]">
          {medication || "No medication prescribed"}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500">Doctor Signature</p>
            <div className="border-b w-32 h-10 mt-6"></div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Incharge Signature</p>
            <div className="border-b w-32 h-10 mt-6"></div>
          </div>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default DigitalSlipSection;
