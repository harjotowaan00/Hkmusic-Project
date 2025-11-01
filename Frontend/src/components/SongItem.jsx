import React, { useContext } from 'react';
import { PlayerContext } from '../context/PlayerContext';
import { FaCheckCircle, FaPlusCircle } from 'react-icons/fa';

const SongItem = ({ name, image, desc, id }) => {
  const { playWithId, myPlaylist, addToMyPlaylist } = useContext(PlayerContext);

  const song = { _id: id, name, image, desc };
  const added = myPlaylist.some((item) => item._id === song._id);

  return (
    <div className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] relative group">
      {/* Image wrapper with relative position */}
      <div className="relative">
        <img
          className="rounded w-full"
          src={image}
          alt={name}
          onClick={() => playWithId(id)}
        />
        {/* Overlay button positioned at bottom-right */}
        <button
          disabled={added}
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering playWithId when clicking button
            addToMyPlaylist(song);
          }}
          className={`
            absolute bottom-2 right-2 text-white text-xl p-1 rounded-full 
            bg-black bg-opacity-50 hover:bg-opacity-75 transition
            ${added ? 'cursor-default opacity-70' : 'cursor-pointer'}
            flex items-center justify-center
          `}
          title={added ? 'Added' : 'Add to Playlist'}
        >
          {added ? <FaCheckCircle /> : <FaPlusCircle />}
        </button>
      </div>

      <p className="font-bold mt-2 mb-1 truncate">{name}</p>
      <p className="text-slate-200 text-sm truncate">{desc}</p>
    </div>
  );
};

export default SongItem;
