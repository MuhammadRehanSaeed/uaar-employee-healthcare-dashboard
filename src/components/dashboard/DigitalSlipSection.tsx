
import { useState } from "react";
import { useRef } from "react";
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

const DigitalSlipSection = () => {
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patientAge, setPatientAge] = useState("");
  const [patientType, setPatientType] = useState("student");
  const [doctor, setDoctor] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [medication, setMedication] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const slipRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Digital Medical Slip</h2>
        <Button 
          onClick={handlePrint}
          className="flex items-center gap-1"
        >
          <Printer className="h-4 w-4" /> Print Slip
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
            <CardDescription>Enter the patient details to generate a medical slip</CardDescription>
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
                <Select 
                  value={patientType} 
                  onValueChange={setPatientType}
                >
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
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-primary">UAAR Healthcare Center</h2>
                <p className="text-gray-500">Medical Slip</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Patient Name</p>
                  <p className="font-medium">{patientName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient ID</p>
                  <p className="font-medium">{patientId || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Age</p>
                  <p className="font-medium">{patientAge || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Patient Type</p>
                  <p className="font-medium capitalize">{patientType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{date || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{doctor || 'N/A'}</p>
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-1">Diagnosis</p>
                <div className="border p-3 rounded min-h-[80px]">
                  {diagnosis || 'No diagnosis provided'}
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-1">Medication & Instructions</p>
                <div className="border p-3 rounded min-h-[100px]">
                  {medication || 'No medication prescribed'}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Patient Signature</p>
                    <div className="border-b w-32 h-10 mt-6"></div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Doctor Signature</p>
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
