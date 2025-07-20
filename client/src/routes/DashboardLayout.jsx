import React from "react";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => (
  <div className="flex min-h-screen w-full">
  
    <div className="fixed top-0 left-0 w-[10vw] h-screen z-50">
      <Sidebar />
    </div>

    <div className="fixed top-0 left-[10vw] w-[90vw]  z-40">
      <Navbar />
    </div>

    <div className="ml-[10vw] mt-[15vh] p-8 min-h-[calc(100vh-5rem)]">
      <Outlet />
    </div>
  </div>
);

export default DashboardLayout;