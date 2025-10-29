import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate, useLocation } from 'react-router-dom'
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filter, setFilter } = useContext(PlayerContext);

  const isHome = location.pathname === "/"; // ✅ Only show filter on Home

  return (
    <>
      <div className='w-full flex justify-between items-center font-semibold'>
        <div className='flex items-center gap-2'>
          <img onClick={() => navigate(-1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt="" />
          <img onClick={() => navigate(1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt="" />
        </div>

        <div className='flex items-center gap-4'>
          <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer'>𝓱𝓴𝓶𝓾𝓼𝓲𝓬</p>
          <p className='bg-purple-500 text-black w-7 h-7 rounded-full flex items-center justify-center'>K</p>
        </div>
      </div>

      {/* ✅ Only show this part on Home page */}
      {isHome && (
        <div className='flex items-center gap-2 mt-4'>
          <p
            onClick={() => setFilter("all")}
            className={`px-4 py-1 rounded-2xl cursor-pointer ${filter === "all" ? "bg-white text-black" : "bg-black text-white"}`}
          >
            All
          </p>

          <p
            onClick={() => setFilter("music")}
            className={`px-4 py-1 rounded-2xl cursor-pointer ${filter === "music" ? "bg-white text-black" : "bg-black text-white"}`}
          >
            Music
          </p>

          <p
            onClick={() => setFilter("albums")}
            className={`px-4 py-1 rounded-2xl cursor-pointer ${filter === "albums" ? "bg-white text-black" : "bg-black text-white"}`}
          >
            Albums
          </p>
        </div>
      )}
    </>
  );
};

export default Navbar;
