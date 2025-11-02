import { createContext, useRef, useState, useEffect, useCallback } from "react";
import axios from 'axios';

export const PlayerContext = createContext();

// Helper to shuffle array (Fisher-Yates)
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Move currently playing track to front of queue
const ensureTrackFirst = (queue, track) => {
  if (!track) return queue;
  const filtered = queue.filter(song => song._id !== track._id);
  return [track, ...filtered];
};

const PlayerContextProvider = (props) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const url = 'https://spotify-project-backend-hznr.onrender.com';

  const [songsData, setSongData] = useState([]);
  const [albumsData, setAlbumData] = useState([]);
  const [track, setTrack] = useState(null);
  const [isLoop, setIsLoop] = useState(false);
  const [playStatus, setPlayStatus] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [filter, setFilter] = useState("all");
  const [queue, setQueue] = useState([]);

  // Volume state: from 0.0 to 1.0
  const [volume, setVolume] = useState(1);

  const [myPlaylist, setMyPlaylist] = useState(() => {
    const saved = localStorage.getItem("myPlaylist");
    return saved ? JSON.parse(saved) : [];
  });

  const removeFromMyPlaylist = useCallback((songId) => {
    setMyPlaylist(prev => prev.filter(song => song._id !== songId));
  }, []);

  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  // Play and pause functions
  const play = () => {
    audioRef.current.play();
    setPlayStatus(true);
  };
  const pause = () => {
    audioRef.current.pause();
    setPlayStatus(false);
  };

  // Toggle loop and shuffle
  const toggleLoop = () => {
    setIsLoop(prev => {
      const newLoop = !prev;
      if (audioRef.current) audioRef.current.loop = newLoop;
      return newLoop;
    });
  };

  const toggleShuffle = useCallback(() => {
    setIsShuffle(prev => {
      const newShuffle = !prev;
      if (newShuffle) {
        setQueue(prevQueue => {
          const shuffled = shuffleArray(prevQueue);
          return ensureTrackFirst(shuffled, track);
        });
      } else {
        // Reset queue to original songsData order with current track on top
        setQueue(() => ensureTrackFirst(songsData, track));
      }
      return newShuffle;
    });
  }, [songsData, track]);

  // Add to queue helper
  const addToQueue = useCallback((song) => {
    setQueue(prevQueue => {
      if (prevQueue.some(s => s._id === song._id)) return prevQueue;
      return ensureTrackFirst([...prevQueue, song], track);
    });
  }, [track]);

  // Play song by ID
  const playWithId = useCallback((id) => {
    const selectedTrack = songsData.find(item => item._id === id);
    if (selectedTrack) {
      setTrack(selectedTrack);
      setPlayStatus(true);
      addToQueue(selectedTrack);
    }
  }, [songsData, addToQueue]);

  const previous = useCallback(() => {
    if (!track) return;
    const currentIndex = queue.findIndex(item => item._id === track._id);
    if (currentIndex > 0) {
      setTrack(queue[currentIndex - 1]);
      setPlayStatus(true);
    }
  }, [queue, track]);

  const next = useCallback(() => {
    if (!track) return;
    const currentIndex = queue.findIndex(item => item._id === track._id);
    let nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) nextIndex = 0;
    setTrack(queue[nextIndex]);
    setPlayStatus(true);
  }, [queue, track]);

  // Seek function - jumping to specific time in the track
  const seekSong = (e) => {
    if (!audioRef.current || !seekBg.current) return;
    const clickX = e.nativeEvent.offsetX;
    const width = seekBg.current.offsetWidth;
    const duration = audioRef.current.duration;
    if (duration && width) {
      audioRef.current.currentTime = (clickX / width) * duration;
    }
  };


  const setVolumeDirect = useCallback((val) => {
    const volumeVal = Math.min(1, Math.max(0, val));
    setVolume(volumeVal);
  }, []);

  // Sync volume state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Effects for side effects and data fetch
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLoop;
    }
  }, [isLoop]);

  useEffect(() => {
    if (audioRef.current && playStatus) {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
      });
    }
  }, [track, playStatus]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.onended = () => {
      if (!isLoop) {
        next();
      }
    };
  }, [track, isLoop, next]);

  useEffect(() => {
    setTimeout(() => {
      if (!audioRef.current) return;
      audioRef.current.ontimeupdate = () => {
        if (!audioRef.current.duration || isNaN(audioRef.current.duration)) {
          setTime({
            currentTime: { second: 0, minute: 0 },
            totalTime: { second: 0, minute: 0 }
          });
          return;
        }
        if (seekBar.current) {
          seekBar.current.style.width =
            (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";
        }
        setTime({
          currentTime: {
            second: Math.floor(audioRef.current.currentTime % 60),
            minute: Math.floor(audioRef.current.currentTime / 60)
          },
          totalTime: {
            second: Math.floor(audioRef.current.duration % 60),
            minute: Math.floor(audioRef.current.duration / 60)
          }
        });
      };
    }, 1000);
  }, [audioRef]);

  const getSongData = async () => {
    try {
      const response = await axios.get(`${url}/api/song/list`);
      setSongData(response.data.songs);
      if (response.data.songs.length > 0) {
        setQueue(ensureTrackFirst(response.data.songs, track));
        if (!track) setTrack(response.data.songs[0]);
      }
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    }
  };

  const getAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      setAlbumData(response.data.albums);
    } catch (error) {
      console.error('Failed to fetch albums:', error);
    }
  };

  useEffect(() => {
    getSongData();
    getAlbumData();
  }, []);

  useEffect(() => {
    localStorage.setItem("myPlaylist", JSON.stringify(myPlaylist));
  }, [myPlaylist]);

  const addToMyPlaylist = useCallback((song) => {
    setMyPlaylist(prev => {
      if (!prev.some(item => item._id === song._id)) {
        return [...prev, song];
      }
      return prev;
    });
  }, []);

  const contextValue = {
    audioRef,
    seekBar,
    seekBg,
    track,
    setTrack,
    playStatus,
    setPlayStatus,
    time,
    setTime,
    play,
    pause,
    playWithId,
    previous,
    next,
    seekSong,
    songsData,
    albumsData,
    isLoop,
    toggleLoop,
    isShuffle,
    toggleShuffle,
    filter,
    setFilter,
    myPlaylist,
    addToMyPlaylist,
    removeFromMyPlaylist,
    queue,
    setQueue,
    volume,
    setVolumeDirect
  };

  return (
    <PlayerContext.Provider value={contextValue}>
      {props.children}
    </PlayerContext.Provider>
  );
};

export default PlayerContextProvider;
