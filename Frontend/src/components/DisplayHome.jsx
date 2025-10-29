import React, { useContext } from 'react'
import Navbar from './Navbar'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem';
import Player from './Player'
import { PlayerContext } from '../context/PlayerContext'
import { useMemo } from "react";





const DisplayHome = () => {

  const { songsData, albumsData, filter } = useContext(PlayerContext);


  const shuffledSongs = useMemo(() => {
    return [...songsData].sort(() => Math.random() - 0.5);
  }, [songsData]);


  return (
    <>
      <Navbar />
      <div className='mb-4'>
        {filter !== "music" && (
          <>
            <h1 className='my-5 font-bold text-2xl text-white'>Featured Albums</h1>
            <div className='flex overflow-auto text-white'>
              {albumsData.map((item, index) => (
                <AlbumItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />
              ))}
            </div>
          </>
        )}
      </div>
      <div className='mb-4'>
        {filter !== "albums" && (
          <>
            <h1 className='my-5 font-bold text-2xl text-white'>Today's biggest hits</h1>
            <div className='flex overflow-auto text-white'>
              {shuffledSongs.map((item, index) => (
                <SongItem key={index} name={item.name} desc={item.desc} id={item._id} image={item.image} />
              ))}
            </div>
          </>
        )}
      </div>


    </>

  )
}

export default DisplayHome