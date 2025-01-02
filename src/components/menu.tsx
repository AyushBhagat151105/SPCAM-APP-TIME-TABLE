import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AiOutlineHome, AiOutlineUser, AiOutlineSetting } from "react-icons/ai";
import {
  MdOutlineSchool,
  MdSubject,
  MdClass,
  MdOutlineAnnouncement,
} from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { FaStream } from "react-icons/fa";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: AiOutlineHome,
        label: "Home",
        href: "/dashboard",
        visible: ["admin", "user"],
      },
      {
        icon: MdOutlineSchool,
        label: "Teachers",
        href: "/dashboard/list/teachers", // Absolute path
        visible: ["admin"],
      },
      {
        icon: FaStream, // Update the icon here
        label: "Stream",
        href: "/dashboard/list/stream", // Absolute path
        visible: ["admin"],
      },
      {
        icon: MdSubject,
        label: "Subjects",
        href: "/dashboard/list/subjects", // Absolute path
        visible: ["admin"],
      },
      {
        icon: MdClass,
        label: "Classes",
        href: "/dashboard/list/class", // Absolute path
        visible: ["admin"],
      },
      {
        icon: BsTable,
        label: "Time-Table",
        href: "/dashboard/list/time-table", // Absolute path
        visible: ["admin", "user"],
      },
      {
        icon: MdOutlineAnnouncement,
        label: "Announcements",
        href: "/dashboard/list/announcements", // Absolute path
        visible: ["admin", "user"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: AiOutlineUser,
        label: "Profile",
        href: "/profile",
        visible: ["admin", "user"],
      },
      {
        icon: AiOutlineSetting,
        label: "Settings",
        href: "/dashboard/list/settings",
        visible: ["admin"],
      },
    ],
  },
];
const Menu = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to the home page if no session is found
  if (!session) {
    return redirect("/");
  }

  const role = session?.user?.role as string;

  return (
    <div className="mt-4 text-sm flex flex-col h-screen">
      {menuItems.map((section) => (
        <div key={section.title} className="mb-6">
          {/* Section Title */}
          <h2 className="text-gray-400 font-semibold mb-4 px-2 hidden lg:block">
            {section.title}
          </h2>

          {/* Menu Items */}
          <div className="flex flex-col gap-2 flex-grow">
            {section.items.map((item) => {
              if (item.visible.includes(role)) {
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 text-gray-300 py-2 px-3 rounded-md hover:bg-gray-700 hover:text-white transition-all"
                  >
                    <item.icon className="text-4xl sm:text-3xl md:text-2xl" />
                    <span className="hidden lg:block">{item.label}</span>
                  </Link>
                );
              }
              return null;
            })}
          </div>
        </div>
      ))}

      {/* Shimmer Button Positioned at Bottom */}
      {/*<div className="flex justify-center pb-20 px-4 mt-auto ">*/}
      {/*  <button className="inline-flex items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 py-3 text-lg font-medium text-slate-400 transition-all animate-shimmer focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 w-full sm:w-auto">*/}
      {/*    Shimmer*/}
      {/*  </button>*/}
      {/*</div>*/}
    </div>
  );
};

export default Menu;
