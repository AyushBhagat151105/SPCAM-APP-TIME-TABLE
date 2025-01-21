"use client";
import { useEffect, useState } from "react";
import LoginPage from "@/components/login-page";

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // Adjust the condition based on the screen size for mobile devices
      setIsMobile(window.innerWidth <= 768); // 768px or smaller is considered mobile
    };

    checkMobile(); // Check on component mount
    window.addEventListener("resize", checkMobile); // Check on window resize

    return () => {
      window.removeEventListener("resize", checkMobile); // Clean up event listener on unmount
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      alert("This is not a mobile-compatible app");
    }
  }, [isMobile]);

  return (
    <>
      <LoginPage />
    </>
  );
}
