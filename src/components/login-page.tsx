import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {FiUser} from "react-icons/fi";
import {BsFillPassFill} from "react-icons/bs";

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
            <h2 className="text-3xl font-semibold text-white mb-12 text-center lg:text-left">
              Login
            </h2>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 flex" htmlFor="email">
                  <FiUser /> <span className="px-2">Email</span>
                </label>
                <Input
                    id="email"
                    placeholder="username@gmail.com"
                    type="email"
                    className="w-full h-12 bg-white/10 border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-white/20"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-300 flex" htmlFor="password">
                  <BsFillPassFill /> <span className="px-2">Password</span>
                </label>
                <Input
                    id="password"
                    placeholder="Password"
                    type="password"
                    className="w-full h-12 bg-white/10 border-0 text-white placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-white/20"
                />
              </div>
              <div className="flex justify-between items-center">
                <Link
                    href="#"
                    className="text-sm text-gray-300 hover:text-white inline-block"
                >
                  Forgot Password?
                </Link>
              </div>
              <Button className="w-full h-12 text-base bg-[#4461F2] hover:bg-[#3451E2]">
                Login
              </Button>
            </form>
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

