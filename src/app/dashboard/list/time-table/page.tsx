// src/app/dashboard/list/time-table/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import TimetableManagement from "@/components/TimetableManagement";
import { getUserRole } from "@/lib/getUserRole";
import { useLoading } from "@/context/LoadingContext";

const TimetablePage = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { setLoading } = useLoading();

  useEffect(() => {
    const fetchUserRole = async () => {
      setLoading(true);
      try {
        const role = await getUserRole();
        setIsAdmin(role === "admin");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [setLoading]);

  return (
    <div>
      <TimetableManagement isAdmin={isAdmin} />
    </div>
  );
};

export default TimetablePage;
