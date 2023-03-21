// Header.js

import { LogoutIcon, UserIcon, HomeIcon, PencilAltIcon } from "@heroicons/react/outline";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


import auth from "../../config/firebase";
import { useAuth } from "../../contexts/AuthContext";
import Logout from "../accounts/Logout";
// import ThemeToggler from "./ThemeToggler";

export default function Header() {
  const [modal, setModal] = useState(false);
  const navigate = useNavigate();

  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        const token = user && (await user.getIdToken());

        console.log(token)

        const payloadHeader = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        const res = await fetch("http://localhost:3001/auth", payloadHeader);
        console.log(await res.text());
        console.log(currentUser);
      } catch (e) {
        console.log(e);
        navigate("/login");

      }
    };

    fetchData();
  }, []);

  return (
    <>
      <nav className="px-2 sm:px-4 py-2.5 bg-slate-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700 text-gray-900 text-sm rounded border dark:text-white">
        <div className="container mx-auto flex flex-wrap items-center justify-between">
          <Link to="/home" className="flex">
            <span className="self-center text-xl font-semibold whitespace-nowrap text-slate-600 dark:text-white font-sans">
              Lifelog
            </span>
          </Link>
          <div className="flex md:order-2">
            {/* <ThemeToggler /> */}

            {currentUser && (
              <>
                <Link
                  to="/home"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <HomeIcon className="w-8 h-8 rounded-full" aria-hidden="true"></HomeIcon>
                </Link>
                <Link
                  to="/journal"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <PencilAltIcon className="w-8 h-8 rounded-full" aria-hidden="true"></PencilAltIcon>
                </Link>
                <Link
                  to="/profile"
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-full text-sm p-2.5"
                >
                  <UserIcon className="w-8 h-8 rounded-full" aria-hidden="true"></UserIcon>
                  {/* <img
                    className="h-8 w-8 rounded-full"
                    src={currentUser.photoURL}
                    alt=""
                  /> */}
                </Link>
                <button
                  className="text-slate-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none rounded-lg text-sm p-2.5"
                  onClick={() => setModal(true)}
                >
                  <LogoutIcon className="h-8 w-8 rounded-full" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      {modal && <Logout modal={modal} setModal={setModal} />}
    </>
  );
}