import React, { useContext } from 'react';
import Navbar from '../components/Navbar';
import { PlayerContext } from '../context/PlayerContext';
import { assets } from '../assets/assets';

const MyPlaylistPage = () => {
  const { myPlaylist, playWithId, removeFromMyPlaylist } = useContext(PlayerContext);

  return (
    <>
      <Navbar />

      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img src={assets.MyPlaylistImg} alt="My Playlist" className="w-48 h-48 object-cover rounded " />
        <div className="flex flex-col text-white">

          <h2 className="text-5xl text-white font-bold mb-4 md:text-7xl">My Playlist</h2>
          <h4>Your favorite songs</h4>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>

        <p className="hidden sm:block">Date Added</p>
        <p className='m-auto w-19'>Singer</p>
        <p className="m-auto w-10">Action</p>
      </div>
      <hr />

      {myPlaylist.length === 0 ? (
        <p className="text-white mt-4 ml-2">Your playlist is empty.</p>
      ) : (
        myPlaylist.map((item, index) => (
          <div

            key={item._id}
            onClick={() => playWithId(item._id)}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
          >
            <p className="text-white">
              <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
              <img className="inline w-10 mr-5" src={item.image || null} alt={item.name} />
              {item.name}
            </p>

            <p className="text-[15px] hidden sm:block">{item.dateAdded || 'just know'}</p>
            <p className="text-[15px] text-center">{item.desc}</p>
            <button
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering playWithId on parent div
                removeFromMyPlaylist(item._id);
              }}
              className="text-red-600 font-bold ml-4"
            >
              X
            </button>

          </div>
        ))
      )}
    </>
  );
};

export default MyPlaylistPage;
