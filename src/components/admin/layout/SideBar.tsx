'use client';

import Menu from "@/components/ui/menu";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Item {
    label: string;
    href: string;
}

const configItems: Item[] = [
    {
        label: "Dashboard",
        href: "/admin/dashboard",
    },
    {
        label: "Lessons",
        href: "/admin/lessons",
    },
    {
        label: "Activities",
        href: "/admin/activities",
    },
    {
        label: "Templates",
        href: "/admin/templates",
    },
];


const SideBar = () => {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const items = useMemo(() => 
        configItems.map(item => ({
            ...item,
            active: pathname === item.href
        })), [pathname]
    );

    const handleClick = (href: string) => {
        router.push(href);
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

  return (
    <div className={`group relative flex flex-col h-screen border-r bg-background transition-all duration-300 ease-in-out ${
      sidebarCollapsed ? 'w-8' : 'w-32'
    }`}>
      {/* Toggle Button */}
      
      <div className="absolute -right-3 top-1/3">
        <Button
          variant="secondary"
          size="sm"
          onClick={toggleSidebar}
          className="h-6 w-6 rounded-full p-0 shadow-md hover:shadow-lg transition-all duration-200"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {/* Sidebar Content */}
      {!sidebarCollapsed && (  
      <div className="flex-1 py-4 px-2">
        <Menu items={items} onClick={handleClick} />
      </div>
      )}
    </div>
  );
};

export default SideBar;