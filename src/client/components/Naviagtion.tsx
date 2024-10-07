"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "./ui/sidebar";
import {
    IconArrowLeft,
    IconBrandTabler,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils.js";
import { useNavigate } from 'react-router-dom';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PieChartIcon from '@mui/icons-material/PieChart';


export default function Navigation() {
    const navigate = useNavigate();
    const links = [
        {
            label: "Dashboard",
            href: "/#/dashboard",
            icon: (
                <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
        {
            label: "Profile",
            href: "/#/profile",
            icon: (
                <AccountBoxIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
        {
            label: "About Us",
            href: "#/about",
            icon: (
                <PieChartIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0"/>
            ),
        },
        {
            label: "Logout",
            href: "/",
            icon: (
                <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" onClick={() => onLogout(navigate)}/>
            ),
        },
    ];

    async function onLogout( navigate: Function ) {
        console.log('Logging out');
        const response = await fetch('/logout', {
            method: 'GET',
        });
        if (response.ok) {
            navigate('/');
        } else {
            console.error('Logout failed');
        }
    }

    const [ open, setOpen ] = useState(false);


    return (
        <div
            className={cn(
                "fixed top-0 left-0 h-screen w-auto rounded-md flex flex-col bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden",
                "md:flex-row max-w-7xl mx-auto flex-1"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                        {open ? <Logo/> : <LogoIcon/>}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map(( link, idx ) => (
                                <SidebarLink key={idx} link={link}/>
                            ))}
                        </div>
                    </div>
                </SidebarBody>
            </Sidebar>

        </div>
    );
}
export const Logo = () => {
  return (
    <a
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        AMAP Job Tracker
      </motion.span>
    </a>
  );
};
export const LogoIcon = () => {
    return (
        <a
            href="#"
            className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
        >
            <div
                className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0"/>
        </a>
    );
};


