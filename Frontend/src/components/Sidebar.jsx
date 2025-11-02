import React, { useContext, useRef, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { queue, track: currentTrack, playWithId } = useContext(PlayerContext);

  const [searchTerm, setSearchTerm] = useState('');

  // For scrolling
  const queueContainerRef = useRef(null);
  const trackRefs = useRef({});

  useEffect(() => {
    if (currentTrack && trackRefs.current[currentTrack._id]) {
      // Scroll current song to top
      trackRefs.current[currentTrack._id].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [currentTrack]);

  const isActive = (path) => location.pathname === path;

  const filteredQueue = queue.filter(song =>
    song.name && song.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-[25%] h-[97%] border-r-4 border-solid border-green-100 p-1 flex-col gap-2 text-white hidden lg:flex bg-[#121212] mt-2">
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

        {/* Search Bar */}
        <div className="flex items-center gap-3 rounded-md p-2 bg-gray-900 mb-2 mt-1">
          <img className="w-6" src={assets.search_icon} alt="Search" />
          <input
            type="text"
            placeholder="Search in queue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent outline-none text-white placeholder-gray-400 w-full"
          />
        </div>

        {/* Queue list */}
        <h2 className="text-white border-b-2 border-green-100 font-semibold mb-2">Up Next</h2>
        <div
          className="p-4   overflow-y-auto max-h-[55vh]"
          ref={queueContainerRef}
        >
          
          {filteredQueue.length === 0 ? (
            <p className="text-gray-400">No songs found</p>
          ) : (
            <ul>
              {filteredQueue.map((song) => (
                <li
                  ref={el => (trackRefs.current[song._id] = el)}
                  key={song._id}
                  className={`flex items-center gap-3 mb-3 cursor-pointer p-2 rounded ${
                    currentTrack && currentTrack._id === song._id
                      ? 'bg-indigo-700'
                      : 'hover:bg-gray-800'
                  }`}
                  onClick={() => playWithId(song._id)}
                  title={song.name}
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
