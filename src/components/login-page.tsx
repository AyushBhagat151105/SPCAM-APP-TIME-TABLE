import Image from "next/image"
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {authClient} from "@/lib/auth-client";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-[url('/1.jpg')] bg-cover bg-center flex">
      {/* Left section with illustration and welcome text - hidden on mobile */}
      <div className="hidden lg:flex lg:flex-1 p-12 flex-col items-start justify-center space-y-8">
        <div className="relative w-full h-[400px]">
          <Image
            src="/1.svg"
            alt="Login illustration"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-white font-bold text-6xl tracking-tight">
          WELCOME
          <br />
          BACK
        </h1>
      </div>

      {/* Right section with login form - full width on mobile */}
      <div className="m-3 flex-1 bg-white/5 backdrop-blur-xl p-8 lg:p-12 flex items-center justify-center rounded-2xl">
        <div className="w-full max-w-md space-y-8">
          <div className="relative w-full h-[100px]">
            <Image
                src="/SPCE-SPCAM.png"
                alt="Login illustration"
                fill
                className="object-contain"
                priority
            />
          </div>
          <div className="flex space-x-4 items-center justify-center">
            <Button><Link href="/sign-up">Sign-up</Link></Button>
            <Button><Link href="/sign-in">Sign-in</Link></Button>
            {/*<Button onClick={async () => {*/}
            {/*  "use server"*/}
            {/*  const newUser = await authClient.admin.createUser({*/}
            {/*    name: "Test User",*/}
            {/*    email: "test@example.com",*/}
            {/*    password: "password123",*/}
            {/*    role: "admin",*/}
            {/*    data: {*/}
            {/*      // any additional on the user table including plugin fields and custom fields*/}
            {/*      customField: "customValue"*/}
            {/*    }*/}
            {/*  });*/}
            {/*}}>create admin</Button>*/}
          </div>
          </div>
        </div>

        {/* Decorative background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute right-0 top-1/4 w-64 lg:w-96 h-64 lg:h-96 bg-[#4461F2]/20 rounded-full blur-3xl" />
        <div className="absolute right-1/4 bottom-0 w-64 lg:w-96 h-64 lg:h-96 bg-[#4461F2]/10 rounded-full blur-3xl" />
      </div>
    </div>
  )
}

