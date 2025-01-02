"use client";
import React, { useEffect, useState } from "react";
import TimetableManagement from "@/components/TimetableManagement";
import { getUserRole } from "@/lib/getUserRole";

const TimetablePage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      const role = await getUserRole();
      setIsAdmin(role === "admin");
    };

    fetchUserRole();
  }, []);

  return (
    <div>
      <TimetableManagement isAdmin={isAdmin} />
    </div>
  );
};

export default TimetablePage;
