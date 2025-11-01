import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'

const SongItem = ({ name, image, desc, id }) => {

  const { playWithId,myPlaylist,addToMyPlaylist } = useContext(PlayerContext);

  const song = { _id: id, name, image, desc };

  return (
    <div className='min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26] relative group'>

      {/* SONG IMAGE */}
      <img
        className='rounded'
        src={image}
        alt=""
        onClick={() => playWithId(id)}
      />

      <button
        disabled={myPlaylist.some(item => item._id === song._id)}
        onClick={() => addToMyPlaylist(song)}
      >
        {myPlaylist.some(item => item._id === song._id) ? 'Added' : 'Add to Playlist'}
      </button>




      <p className='font-bold mt-2 mb-1'>{name}</p>
      <p className='text-slate-200 text-sm'>{desc}</p>
    </div>
  )
}

export default SongItem
