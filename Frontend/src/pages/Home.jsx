import React, { useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Display from '../components/Display';
import Player from '../components/Player';
import { PlayerContext } from '../context/PlayerContext';
import DisplayAlbum from '../components/DisplayAlbum';

useEffect(() => {
  if (!localStorage.getItem("token")) {
    window.location.href = "/";
  }
}, []);


const Home = () => {
  const { audioRef, track, songsData } = useContext(PlayerContext);

  return (
    <div className="h-screen bg-black">
      {
        songsData.length !== 0 &&
        <>
          <div className='h-[90%] flex'>
            <Sidebar />
            <Display />
          </div>
          <Player />
        </>
      }

      <audio ref={audioRef} src={track ? track.file : ""} preload="auto" />
    </div>
  );
};

export default Home;
