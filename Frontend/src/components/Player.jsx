import React, { useContext, useState, useEffect } from 'react'
import { assets, } from '../assets/assets';
import { PlayerContext } from '../context/PlayerContext';



const Player = () => {
  const { track, seekBar, seekBg, playStatus, play, pause, time, previous, next, seekSong, isLoop, toggleLoop, isShuffle, toggleShuffle, volume,
    setVolumeDirect } = useContext(PlayerContext)


  const onVolumeChange = (e) => setVolumeDirect(parseFloat(e.target.value));

  return track ? (
    <div className='h-[10%] bg-black flex justify-between items-center text-white px-4'>
      <div className=' hidden lg:flex items-center gap-4'>
        <img className='w-12' src={track.image} alt="" />
        <div>
          <p>{track.name}</p>
          <p>{track.desc.slice(0, 12)}</p>
        </div>
      </div>
      <div className='flex flex-col items-center gap-1 m-auto'>
        <div className='flex gap-4'>
          <img
            onClick={toggleShuffle}
            src={assets.shuffle_icon}
            alt="shuffle"
            className={`w-4 cursor-pointer transition-all 
    ${isShuffle ? "shuffle-active" : ""}`}
          />
          <img onClick={previous} className='w-4 cursor-pointer' src={assets.prev_icon} alt="" />
          {playStatus
            ? <img onClick={pause} className='w-4 cursor-pointer' src={assets.pause_icon} alt="" />
            :
            <img onClick={play} className='w-4 cursor-pointer' src={assets.play_icon} alt="" />
          }
          <img onClick={next} className='w-4 cursor-pointer' src={assets.next_icon} alt="" />
          <img
            onClick={toggleLoop}
            className={`w-4 cursor-pointer transition-all 
    ${isLoop ? "loop-active" : ""}`}
            src={assets.loop_icon}
            alt="loop"
          />
        </div>
        <div className='flex items-center gap-5'>
          <p>
            {isNaN(time.currentTime.minute) ? "0" : time.currentTime.minute}:
            {isNaN(time.currentTime.second) ? "00" : time.currentTime.second.toString().padStart(2, "0")}
          </p>
          <div ref={seekBg} onClick={seekSong} className='w-[60vw] max-w-[500px] bg-gray-300 rounded-full cursor-pointer'>
            <hr ref={seekBar} className='h-1 border-none w-0 bg-green-800 rounded-full' />
          </div>
          <p>
            {isNaN(time.totalTime.minute) ? "--" : time.totalTime.minute}:
            {isNaN(time.totalTime.second) ? "--" : time.totalTime.second.toString().padStart(2, "0")}
          </p>
        </div>
      </div>
      <div className='hidden lg:flex items-center gap-2 opacity-75'>

        <div className='relative cursor-pointer flex items-center gap-2'>
          <img className='w-4' src={assets.volume_icon} alt="Volume" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={onVolumeChange}
            className="w-24 h-1 accent-green-400 rounded"
          />
        </div>



      </div>
    </div>
  ) : null
}

export default Player