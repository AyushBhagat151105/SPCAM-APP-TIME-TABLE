// src/components/ClientProvider.tsx
"use client";
import { LoadingProvider } from "@/context/LoadingContext";
import LoadingIndicator from "@/components/LoadingIndicator";
import React, { ReactNode } from "react";

const ClientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <LoadingProvider>
      <LoadingIndicator />
      {children}
    </LoadingProvider>
  );
};

export default ClientProvider;
