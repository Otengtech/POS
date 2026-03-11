import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  CogIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
  XMarkIcon,
  Bars3Icon
} from "@heroicons/react/24/outline";

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMenu = () => setMobileMenuOpen(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon, roles: ["super_admin", "admin"] },
    { name: "Admins", href: "/admins", icon: UserGroupIcon, roles: ["super_admin"] },
    { name: "Businesses", href: "/businesses", icon: BuildingOfficeIcon, roles: ["super_admin", "admin"] },
    { name: "Branches", href: "/branches", icon: MapPinIcon, roles: ["super_admin", "admin"] },
    { name: "Products", href: "/products", icon: ShoppingBagIcon, roles: ["super_admin", "admin"] },
    { name: "Sales", href: "/sales", icon: CurrencyDollarIcon, roles: ["super_admin", "admin"] },
    { name: "Inventory", href: "/inventory", icon: ArchiveBoxIcon, roles: ["super_admin", "admin"] },
    { name: "Reports", href: "/reports", icon: ChartBarIcon, roles: ["super_admin", "admin"] },
    { name: "Settings", href: "/settings", icon: CogIcon, roles: ["super_admin", "admin"] }
  ];

  const filteredNavigation = navigation.filter((item) =>
    item.roles.some((role) => hasRole(role))
  );

  const linkClass = ({ isActive }) =>
    `group flex items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all ${
      isActive
        ? "bg-black text-white shadow-lg"
        : "bg-white text-black hover:bg-gray-100"
    }`;

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:fixed lg:inset-y-0 md:flex lg:flex lg:w-72 lg:flex-col">

        <div className="relative flex flex-col flex-1 min-h-0">
          {/* LOGO */}
          <div className="flex items-center h-20 px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-bold">
                $
              </div>
              <div>
                <h1 className="text-lg font-semibold text-black">POS System</h1>
                <p className="text-xs text-black">Enterprise Management</p>
              </div>
            </div>
          </div>

          {/* NAVIGATION */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {filteredNavigation.map((item) => (
              <NavLink key={item.name} to={item.href} className={linkClass}>
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* USER */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>

              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>

              <button
                onClick={logout}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#AFC1B3]">
        <div className="flex items-center justify-between px-4 h-16">
          <h1 className="text-white font-semibold">POS System</h1>

          <button
            onClick={toggleMenu}
            className="p-2 text-white"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE SIDEBAR */}
      <div
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#AFC1B3] transform transition-transform duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* NAV */}
          <nav className="flex-1 px-4 py-6 space-y-2 mt-16">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={closeMenu}
                className={linkClass}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* USER */}
          <div className="p-4 border-t border-white/10">
            <div className="bg-white rounded-lg p-3 flex items-center">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>

              <div className="ml-3 flex-1">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-600">{user?.role}</p>
              </div>

              <button
                onClick={() => {
                  logout();
                  closeMenu();
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SPACER */}
      <div className="lg:hidden h-16" />
    </>
  );
};

export default Sidebar;