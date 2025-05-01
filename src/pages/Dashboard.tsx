
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import StudentsSection from "@/components/dashboard/StudentsSection";
import DoctorsSection from "@/components/dashboard/DoctorsSection";
import EmployeeSection from "@/components/dashboard/EmployeeSection";
import ExternalDoctorsSection from "@/components/dashboard/ExternalDoctorsSection";
import DigitalSlipSection from "@/components/dashboard/DigitalSlipSection";
import AllMedicalSlips from "@/components/dashboard/medicalslip";
import MedicalInventory from "@/components/dashboard/medicalinventory";
import LabsSection from "@/components/dashboard/lab";
import HospitalsSection from "@/components/dashboard/hospitals";

const Dashboard = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  
  // Set default section if none is provided
  useEffect(() => {
    if (!section) {
      navigate("/dashboard/students");
    }
  }, [section, navigate]);

  // Function to render the appropriate section based on URL
  const renderSection = () => {
    switch (section) {
      case "students":
        return <StudentsSection />;
      case "doctors":
        return <DoctorsSection />;
      case "employees":
        return <EmployeeSection />;
      case "external-doctors":
        return <ExternalDoctorsSection />;
      case "digital-slip":
        return <DigitalSlipSection />;
      case "medical-slip":
        return <AllMedicalSlips />;
      case "medical-inventory":
          return <MedicalInventory/>;
      case "medical-labs":
            return <LabsSection/>;
      case "medical-hospitals":
            return <HospitalsSection/>;
      
      default:
        return <StudentsSection />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-6 lg:p-10 ml-0 md:ml-64 transition-all duration-300">
        {renderSection()}
      </div>
    </div>
  );
};

export default Dashboard;
