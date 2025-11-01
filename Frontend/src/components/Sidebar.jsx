import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext'; // Ensure this context provides queue, current track id, and playWithId

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { queue, track: currentTrack, playWithId } = useContext(PlayerContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-[25%] h-[97%] border-r-4 border-solid border-green-100 p-1 flex-col gap-2 text-white hidden lg:flex bg-[#121212]  mt-2  ">
      {/* Navigation */}
      <div className="flex flex-col gap-3 p-4">
        <div
          onClick={() => navigate('/')}
          className={`flex items-center gap-3 cursor-pointer rounded-md p-2 transition
            ${isActive('/') ? 'bg-gray-700 text-indigo-400' : 'hover:bg-gray-800 hover:text-indigo-300'}`}
        >
          <img className="w-6" src={assets.home_icon} alt="Home" />
          <p className="font-bold">Home</p>
        </div>

        {/* Queue list in place of search */}
        <div className="p-4 border-t border-gray-700 overflow-y-auto max-h-[70vh]">
          <h2 className="text-white font-semibold mb-2">Up Next</h2>
          {queue.length === 0 ? (
            <p className="text-gray-400">Queue is empty</p>
          ) : (
            <ul>
              {queue.map((song) => (
                <li
                  key={song._id}
                  className={`flex items-center gap-3 mb-3 cursor-pointer p-2 rounded ${
                    currentTrack && currentTrack._id === song._id
                      ? 'bg-indigo-700'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => playWithId(song._id)}
                  title={`${song.name}`}
                >
                  <img src={song.image} alt={song.name} className="w-10 h-10 rounded object-cover" />
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-semibold truncate">{song.name}</span>
                    <span className="text-xs text-gray-400 truncate">{song.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
