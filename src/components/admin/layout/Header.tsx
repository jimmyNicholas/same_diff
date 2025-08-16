"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ThemeToggle } from "@/components/ui/themeToggle";

const Header = () => {
  const [username, setUsername] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const session = localStorage.getItem("adminSession");
    if (!session) {
      router.push("/login/admin");
      return;
    }

    // Set username from stored credentials
    setUsername("admin");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminSession");
    router.push("/login/admin");
  };

  return (
    <div className="shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              Admin Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">
              Welcome, <span className="font-semibold">{username}</span>
            </span>
            <Button
              onClick={handleLogout}
              variant="destructive"
            >
              Logout
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
