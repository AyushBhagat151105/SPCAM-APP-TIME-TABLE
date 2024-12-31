import Link from "next/link";
import Navbar from "@/components/navbar";
import Menu from "@/components/menu";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      {/* LEFT */}
      <div className="w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4 bg-white/5 backdrop-blur-xl">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          {/*<Image src="/logo.png" alt="logo" width={32} height={32}/>*/}
          <span className="hidden lg:block font-bold">SPCAM</span>
        </Link>
        <Menu />
      </div>
      {/* RIGHT */}
      <div className="w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-[#1b1e2e] overflow-scroll flex flex-col">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
