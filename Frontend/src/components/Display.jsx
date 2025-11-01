import React, { useContext, useEffect, useRef } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { PlayerContext } from '../context/PlayerContext';

const Display = () => {
  const { albumsData } = useContext(PlayerContext);
  const displayRef = useRef();
  const location = useLocation();
  const { id: albumId } = useParams();

  const isAlbum = location.pathname.includes("album");
  const bgColor =
    isAlbum && albumsData.length > 0
      ? albumsData.find(x => x._id === albumId)?.bgColour ?? "121212"
      : "121212";

  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.style.background = isAlbum
        ? `linear-gradient(${bgColor}, #121212)`
        : "#121212";
    }
  }, [bgColor, isAlbum]);

  return (
    <div
      ref={displayRef}
      className="w-[100%] m-2 px-6 pt-4 rounded bg-[#121212] text-white overflow-auto lg:w-[75%] lg:ml-0"
    >
      <Outlet /> {/* Required for nested routes rendering */}
    </div>
  );
};

export default Display;
