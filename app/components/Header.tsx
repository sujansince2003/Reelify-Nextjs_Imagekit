"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

const Header = () => {
  const session = useSession();
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div>
      <div className="navbar bg-base-100 shadow-sm px-16">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-2xl">
            Reelify.
          </Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-2">
            {session.status == "unauthenticated" && (
              <>
                <li>
                  <Link className="text-xl" href="/login">
                    Login
                  </Link>
                </li>
                <li>
                  <Link className="text-xl" href="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            {session.status == "authenticated" && (
              <li>
                <button className="text-xl" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
