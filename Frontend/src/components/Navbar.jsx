import React, { useState, useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayerContext } from "../context/PlayerContext";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { filter, setFilter } = useContext(PlayerContext);

  const isHome = location.pathname === "/home";

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };
  const goToMyPlaylist = () => {
    navigate('/my-playlist');
  };

  return (
    <>
      <div className='w-full flex justify-between items-center font-semibold relative'>



        <div className='flex flex-col items-start gap-2'>
          <div className='flex items-center gap-2'>
            <img onClick={() => navigate(-1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_left} alt="" />
            <img onClick={() => navigate(1)} className='w-8 bg-black p-2 rounded-2xl cursor-pointer' src={assets.arrow_right} alt="" />
          </div>
          {isHome && (
            <div className='flex gap-2 mt-2'>
              <p onClick={() => setFilter("all")}
                className={`px-4 py-1 rounded-2xl cursor-pointer ${filter === "all" ? "bg-white text-black" : "bg-black text-white"}`}>
                All
              </p>
              <p onClick={() => setFilter("music")}
                className={`px-4 py-1 rounded-2xl cursor-pointer ${filter === "music" ? "bg-white text-black" : "bg-black text-white"}`}>
                Music
              </p>
              <p onClick={() => setFilter("albums")}
                className={`px-4 py-1 rounded-2xl cursor-pointer ${filter === "albums" ? "bg-white text-black" : "bg-black text-white"}`}>
                Albums
              </p>
            </div>
          )}
        </div>



        <div className='flex items-center gap-4'>


          <p className='bg-white text-black text-[15px] px-4 py-1 rounded-2xl md:block cursor-pointer hidden lg:block'>𝓱𝓴𝓶𝓾𝓼𝓲𝓬</p>

          {/* PROFILE DROPDOWN */}
          <div className="relative">
            <p
              onClick={() => setMenuOpen(!menuOpen)}
              className='bg-purple-500 text-black w-8 h-8 rounded-full flex items-center justify-center cursor-pointer select-none'>
              K
            </p>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-neutral-900 border border-neutral-700 rounded-xl shadow-xl p-2 animate-fadeIn">

                <button
                  onClick={goToMyPlaylist}
                  className="text-white px-3 py-2 hover:bg-neutral-800 rounded-md cursor-pointer"
                >
                  My Playlist
                </button>

                {localStorage.getItem("role") === "admin" && (
                  <button className="text-white px-3 py-2 hover:bg-neutral-800 rounded-md cursor-pointer" onClick={() => window.open('https://spotify-project-admin-panel.onrender.com', '_blank')}>
                    Admin Panel
                  </button>

                )}
                <p className="text-white px-3 py-2 hover:bg-neutral-800 rounded-md cursor-pointer" onClick={handleLogout}>
                  Sign Out
                </p>
              </div>
            )}
          </div>
        </div>
      </div>


    </>
  );
};

export default Navbar;
