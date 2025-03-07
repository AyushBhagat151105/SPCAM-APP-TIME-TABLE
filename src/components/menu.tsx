import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AiOutlineUser,
  AiOutlineSetting,
  AiOutlineDashboard,
} from "react-icons/ai";
import {
  MdOutlineSchool,
  MdSubject,
  MdClass,
} from "react-icons/md";
import { BsTable } from "react-icons/bs";
import { FaStream, FaSignOutAlt } from "react-icons/fa";
import { RiCodeView } from "react-icons/ri";

const menuItems = [
  {
    title: "MAIN",
    items: [
      {
        icon: AiOutlineDashboard,
        label: "Dashboard",
        href: "/dashboard",
        visible: ["admin", "user"],
      },
      {
        icon: MdOutlineSchool,
        label: "Teachers",
        href: "/dashboard/list/teachers",
        visible: ["admin"],
      },
      {
        icon: FaStream,
        label: "Streams",
        href: "/dashboard/list/stream",
        visible: ["admin"],
      },
      {
        icon: MdSubject,
        label: "Subjects",
        href: "/dashboard/list/subjects",
        visible: ["admin"],
      },
      {
        icon: MdClass,
        label: "Classes",
        href: "/dashboard/list/class",
        visible: ["admin"],
      },
      {
        icon: BsTable,
        label: "Timetable",
        href: "/dashboard/list/time-table",
        visible: ["admin", "user"],
      },
      // {
      //   icon: MdOutlineAnnouncement,
      //   label: "Announcements",
      //   href: "/dashboard/list/announcements",
      //   visible: ["admin", "user"],
      // },
    ],
  },
  {
    title: "PERSONAL",
    items: [
      // {
      //   icon: AiOutlineUser,
      //   label: "Profile",
      //   href: "/profile",
      //   visible: ["admin", "user"],
      // },
      {
        icon: RiCodeView,
        label: "Developers",
        href: "/dashboard/list/dev",
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

  if (!session) {
    return redirect("/");
  }

  const role = session?.user?.role as string;
  const user = session?.user;

  return (
    <div className="bg-gray-900 text-white h-screen flex flex-col overflow-hidden">
      {/* User Profile Section */}
      <div className="bg-gray-800 p-6 flex items-center space-x-4 border-b border-gray-700">
        <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
          <AiOutlineUser className="text-2xl text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user?.name}</h2>
          <p className="text-sm text-gray-400 capitalize">{role}</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-grow overflow-y-auto py-4 px-2 space-y-6">
        {menuItems.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-gray-500 uppercase px-4 mb-2">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => {
                if (item.visible.includes(role)) {
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group flex items-center px-4 py-2 text-gray-300
                      hover:bg-gray-800 hover:text-white transition-colors
                      rounded-md"
                    >
                      <item.icon className="text-xl mr-4 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-sm">{item.label}</span>
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Sign Out Section */}
      <div className="bg-gray-800 p-4 border-t border-gray-700">
        <form
          action={async () => {
            "use server";
            await auth.api.signOut({
              headers: await headers(),
            });
            redirect("/");
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center
            bg-red-600 hover:bg-red-500 text-white
            py-2 rounded-md transition-colors
            space-x-2 group"
          >
            <FaSignOutAlt className="text-lg group-hover:rotate-180 transition-transform" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Menu;
