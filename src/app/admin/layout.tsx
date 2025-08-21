'use client';

import Header from "@/components/admin/layout/Header";
import SideBar from "@/components/admin/layout/SideBar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => { 

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1">
        <SideBar />
        <div className="flex-1 p-4 transition-all duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;