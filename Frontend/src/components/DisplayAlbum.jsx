import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';
import { FaCheckCircle, FaPlusCircle } from 'react-icons/fa';

const DisplayAlbum = () => {
  const { id } = useParams();
  const { playWithId, albumsData, songsData, myPlaylist, addToMyPlaylist } = useContext(PlayerContext);


  const [albumData, setAlbumData] = useState(null);

  useEffect(() => {
    const album = albumsData.find(item => item._id === id);
    setAlbumData(album || null); // null if not found to avoid errors
  }, [albumsData, id]);

  if (!albumData) return null; // or a loading indicator

  return (
    <>
      <Navbar />

      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        {albumData.image ? (
          <img className="w-48 rounded" src={albumData.image} alt={albumData.name} />
        ) : (
          <div>No image available</div>
        )}
        <div className="flex flex-col text-white">
          <p>Playlist</p>
          <h2 className="text-5xl text-white font-bold mb-4 md:text-7xl">{albumData.name}</h2>
          <h4>{albumData.desc}</h4>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 pl-2 text-[#a7a7a7]">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="Clock icon" />
        <p className="m-auto w-10">Action</p>
      </div>
      <hr />

      {songsData
        .filter(item => albumData && item.album === albumData.name)
        .map((item, index) => {

          const added = myPlaylist.some((myItem) => myItem._id === item._id);

          return (
            <div
              onClick={() => playWithId(item._id)}
              key={index}
              className="relative grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
            >
              <p className="text-white">
                <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
                <img className="inline w-10 mr-5" src={item.image || null} alt={item.name} />
                {item.name}
              </p>
              <p className="text-[15px]">{albumData.name}</p>
              <p className="text-[15px] text-center">{item.duration}</p>
              <button
                disabled={added}
                onClick={(e) => {
                  e.stopPropagation(); // prevent triggering playWithId when clicking button
                  addToMyPlaylist(item);
                }}
                className={`
                        absolute bottom-2 right-2 text-white text-xl p-1 rounded-full 
                        bg-black bg-opacity-50 hover:bg-opacity-75 transition
                        ${added ? 'cursor-default opacity-70' : 'cursor-pointer'}
                        flex items-center justify-center mr-20
                      `}
                title={added ? 'Added' : 'Add to Playlist'}
              >
                {added ? <FaCheckCircle /> : <FaPlusCircle />}
              </button>
            </div>
          )
        })}
    </>
  );
};

export default DisplayAlbum;
