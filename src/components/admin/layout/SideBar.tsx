'use client';

import Menu from "@/components/ui/menu";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

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

    const items = useMemo(() => 
        configItems.map(item => ({
            ...item,
            active: pathname === item.href
        })), [pathname]
    );

    const handleClick = (href: string) => {
        router.push(href);
    };

  return (
    <div className="flex flex-col h-screen border w-32 py-2 items-center">
      <Menu items={items} onClick={handleClick} />
    </div>
  );
};

export default SideBar;