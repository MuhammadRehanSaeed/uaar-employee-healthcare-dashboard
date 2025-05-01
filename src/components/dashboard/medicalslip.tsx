"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Loader2, Trash2, Search } from "lucide-react";

const SlipsPerPage = 6;

const AllMedicalSlips = () => {
  const [medicalSlips, setMedicalSlips] = useState<any[]>([]);
  const [filteredSlips, setFilteredSlips] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [todayCount, setTodayCount] = useState(0);
  const [showTodayOnly, setShowTodayOnly] = useState(false);

  useEffect(() => {
    const fetchMedicalSlips = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "medicalSlips"));
        const slips: any[] = [];
        let todayCount = 0;

        const todayStr = new Date().toISOString().split("T")[0];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          slips.push({ id: docSnap.id, ...data });

          if (data.date === todayStr) {
            todayCount += 1;
          }
        });

        setMedicalSlips(slips);
        setFilteredSlips(slips);
        setTodayCount(todayCount);
      } catch (error) {
        console.error("Error fetching medical slips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalSlips();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = medicalSlips.filter(
      (slip) =>
        slip.patientName?.toLowerCase().includes(term) ||
        slip.patientId?.toLowerCase().includes(term)
    );
    setFilteredSlips(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this slip?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "medicalSlips", id));
      const updatedSlips = medicalSlips.filter((slip) => slip.id !== id);
      setMedicalSlips(updatedSlips);
      setFilteredSlips(updatedSlips);
      alert("Slip deleted successfully.");
    } catch (error) {
      console.error("Error deleting slip:", error);
      alert("Failed to delete slip.");
    }
  };

  const todayStr = new Date().toISOString().split("T")[0];

  const visibleSlips = filteredSlips.filter((slip) =>
    showTodayOnly ? slip.date === todayStr : true
  );

  const totalPages = Math.ceil(visibleSlips.length / SlipsPerPage);
  const paginatedSlips = visibleSlips.slice(
    (currentPage - 1) * SlipsPerPage,
    currentPage * SlipsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">All Medical Slips</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Slips generated today: <span className="font-semibold">{todayCount}</span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Search by Patient Name or ID"
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
          </div>
          <Button
            variant={showTodayOnly ? "outline" : "default"}
            onClick={() => {
              setShowTodayOnly((prev) => !prev);
              setCurrentPage(1); // Reset to first page
            }}
          >
            {showTodayOnly ? "Show All Slips" : "Show Today's Slips"}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {paginatedSlips.length === 0 ? (
            <p>No medical slips found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedSlips.map((slip) => (
                <Card key={slip.id} className="relative shadow-md">
                  <CardHeader>
                    <CardTitle className="text-lg">{slip.patientName || "Unnamed Patient"}</CardTitle>
                    <CardDescription>Patient ID: {slip.patientId}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p><strong>Age:</strong> {slip.patientAge || "N/A"}</p>
                    <p><strong>Type:</strong> {slip.patientType}</p>
                    <p><strong>Doctor:</strong> {slip.doctor}</p>
                    <p><strong>Date:</strong> {slip.date}</p>
                    <p><strong>Valid Till:</strong> {slip.validTill}</p>

                    <div>
                      <p className="font-semibold mt-2">Diagnosis:</p>
                      <p className="border p-2 rounded bg-gray-50">{slip.diagnosis || "No diagnosis"}</p>
                    </div>
                    <div>
                      <p className="font-semibold mt-2">Medication:</p>
                      <p className="border p-2 rounded bg-gray-50">{slip.medication || "No medication"}</p>
                    </div>
                    <div>
                      <p className="font-semibold mt-2">Treatment:</p>
                      <p className="border p-2 rounded bg-gray-50">{slip.treatment || "No treatment"}</p>
                    </div>
                    <div>
                      <p className="font-semibold mt-2">Test:</p>
                      <p className="border p-2 rounded bg-gray-50">{slip.test || "No test"}</p>
                    </div>
                    <div>
                      <p className="font-semibold mt-2">prescribed Medicine:</p>
                      <p className="border p-2 rounded bg-gray-50">{slip.prescribedMedicine || "No Medicine"}</p>
                    </div>
                    <div>
                      <p className="font-semibold mt-2">prescribed Medicine Quantity:</p>
                      <p className="border p-2 rounded bg-gray-50">{slip.prescribedMedicineQuantity || "No Medicine"}</p>
                    </div>
                  
                  </CardContent>

                  <Button
                    onClick={() => handleDelete(slip.id)}
                    size="icon"
                    variant="destructive"
                    className="absolute top-4 right-4"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <Button onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </Button>
              <p>
                Showing {visibleSlips.length} slip{visibleSlips.length !== 1 ? "s" : ""} — Page {currentPage} of {totalPages}
              </p>
              <Button onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllMedicalSlips;
