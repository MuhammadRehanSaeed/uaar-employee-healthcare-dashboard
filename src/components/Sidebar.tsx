
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Pill } from "lucide-react";
import { Microscope } from 'lucide-react';
import { Hospital } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  UserPlus, 
  Users, 
  Monitor, 
  LogOut, 
  Menu, 
  X,
  Printer,
  UserMinus,
  Stethoscope
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: NavItem[] = [
    {
      title: "Students",
      href: "/dashboard/students",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    {
      title: "Doctors",
      href: "/dashboard/doctors",
      icon: <Stethoscope className="mr-2 h-5 w-5" />,
    },
    {
      title: "Employees",
      href: "/dashboard/employees",
      icon: <UserPlus className="mr-2 h-5 w-5" />,
    },
    {
      title: "External Doctors",
      href: "/dashboard/external-doctors",
      icon: <UserMinus className="mr-2 h-5 w-5" />,
    },
    {
      title: "Digital Slip",
      href: "/dashboard/digital-slip",
      icon: <Printer className="mr-2 h-5 w-5" />,
    },
    {
      title: "Medical Slip",
      href: "/dashboard/medical-slip",
      icon: <FileText className="mr-2 h-5 w-5" />,
    },
    {
      title: "Medical Inventory",
      href: "/dashboard/medical-inventory",
      icon: <Pill className="mr-2 h-5 w-5" />,
    },
    {
      title: "Labs",
      href: "/dashboard/medical-labs",
      icon: <Microscope className="mr-2 h-5 w-5" />,
    },
    {
      title: "Hospitals",
      href: "/dashboard/medical-hospitals",
      icon: <Hospital className="mr-2 h-5 w-5" />,
    },
  ];

  const handleLogout = () => {
    // In a real app, you would handle logout here
    navigate("/");
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>
      
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 transform bg-white transition-transform duration-300 ease-in-out shadow-lg md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <div className="flex items-center space-x-2">
              <Monitor className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold">Healthcare Admin</h1>
            </div>
          </div>
          
          <Separator />
          
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
          
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center" 
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
