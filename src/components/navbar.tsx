import Link from "next/link";
import { Button, buttonVariants } from "./ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { FaSignOutAlt, FaSignInAlt, FaUserCog } from "react-icons/fa";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <nav className="bg-[#1b1e2e] border-b border-gray-700 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo and Title */}
        <Link href="/" className="flex items-center gap-4 group">
          <Image
            src="/SPCE-SPCAM.png"
            width={48}
            height={48}
            alt="logo"
            className="rounded-full transform transition duration-300 group-hover:scale-110"
          />
          <span className="text-lg font-bold text-orange-500 group-hover:text-orange-400 transition">
            Sardar Patel College of Administration & Management
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {/* User Profile */}
              {user && (
                <div className="flex items-center mr-4">
                  <FaUserCog className="text-gray-300 mr-2" />
                  <span className="text-gray-300">{user.name}</span>
                </div>
              )}

              {/* Sign Out */}
              <form
                action={async () => {
                  "use server";
                  await auth.api.signOut({
                    headers: await headers(),
                  });
                  redirect("/");
                }}
              >
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md shadow-md transition flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Sign Out
                </Button>
              </form>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className={buttonVariants({
                className:
                  "bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-md shadow-md transition flex items-center",
              })}
            >
              <FaSignInAlt className="mr-2" /> Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
