import React, { use } from 'react'
import useAuthUser from "../hooks/useAuthUser.js"
import {useMutation, useQueryClient } from '@tanstack/react-query';
import {useLocation, Link} from "react-router"
import {logout} from "../lib/api.js";
import { BellIcon, ShipWheelIcon, LogOutIcon } from 'lucide-react';
import ThemeSelector from './ThemeSelector.jsx';

const Navbar = () => {
  const {authUser} = useAuthUser();
  const location = useLocation();
  const isChatPage = location.pathname?.startsWith("/chat");
  
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => queryClient.invalidateQueries({queryKey : ["authUser"]}) 
  })


  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center px-4 sm:px-6 lg:px-8">
  {/* Logo on the left */}
  {isChatPage && (
    <div className="flex items-center gap-2.5">
      <ShipWheelIcon className="size-9 text-primary" />
      <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
        Stream Chat
      </span>
    </div>
  )}

  {/* Right-aligned items */}
  <div className="ml-auto flex items-center gap-3 sm:gap-4">
    <Link to="/notifications">
      <button className="btn btn-ghost btn-circle">
        <BellIcon className="h-6 w-6 text-base-content opacity-70" />
      </button>
    </Link>

    <ThemeSelector />

    <div className="avatar">
      <div className="w-9 rounded-full">
        <img src={authUser?.profilePic} alt="User Avatar" />
      </div>
    </div>

    <button
      className="btn btn-ghost btn-circle"
      onClick={() => logoutMutation.mutate()}
    >
      <LogOutIcon className="h-6 w-6 text-base-content opacity-70" />
    </button>
  </div>
</nav>

  );
}

export default Navbar 