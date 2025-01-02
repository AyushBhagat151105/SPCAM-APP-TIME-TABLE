import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="container mx-auto grid md:grid-cols-2 gap-12 p-6">
        {/* Left section with illustration */}
        <div className="hidden md:flex flex-col justify-center items-center space-y-8">
          <div className="relative w-full max-w-md h-[400px]">
            <Image
              src="/1.svg"
              alt="Login illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-white font-bold text-5xl text-center tracking-tight">
            WELCOME <br /> BACK
          </h1>
        </div>

        {/* Right section with form */}
        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <div className="relative w-full max-w-xs h-24 mx-auto mb-8">
            <Image
              src="/SPCE-SPCAM.png"
              alt="College Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          {children}
        </div>
      </div>

      {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute right-0 top-1/4 w-64 md:w-96 h-64 md:h-96
          bg-indigo-500/10 rounded-full blur-3xl"
        />
        <div
          className="absolute right-1/4 bottom-0 w-64 md:w-96 h-64 md:h-96
          bg-indigo-500/5 rounded-full blur-3xl"
        />
      </div>
    </main>
  );
}
