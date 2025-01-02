// src/components/LoadingIndicator.tsx
import React from "react";
import { useLoading } from "@/context/LoadingContext";

const LoadingIndicator: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="loader">Loading...</div>
    </div>
  );
};

export default LoadingIndicator;
