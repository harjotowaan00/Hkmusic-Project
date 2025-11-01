import { createContext, useRef, useState, useEffect, use } from "react";
import axios from 'axios'

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {

    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    const url = 'https://spotify-project-backend-hznr.onrender.com';

    const [songsData, setSongData] = useState([]);
    const [albumsData, setAlbumData] = useState([]);
    const [track, setTrack] = useState(songsData[0]);
    const [isLoop, setIsLoop] = useState(false);
    const [playStatus, setPlayStatus] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [filter, setFilter] = useState("all");
    const [myPlaylist, setMyPlaylist] = useState(() => {
        const saved = localStorage.getItem("myPlaylist");
        return saved ? JSON.parse(saved) : [];
    });
    const removeFromMyPlaylist = (songId) => {
  setMyPlaylist(prev => prev.filter(song => song._id !== songId));
};





    const [time, setTime] = useState({
        currentTime: {
            second: 0,
            minute: 0,
        },
        totalTime: {
            second: 0,
            minute: 0,
        },

    })
    const play = () => {
        audioRef.current.play();
        setPlayStatus(true)
    }
    const pause = () => {
        audioRef.current.pause();
        setPlayStatus(false);

    }
    const toggleLoop = () => {
        setIsLoop(prev => !prev);
        if (audioRef.current) {
            audioRef.current.loop = !isLoop;
        }
    };
    const toggleShuffle = () => {
        setIsShuffle(prev => !prev);
    };



    const playWithId = (id) => {
        const selectedTrack = songsData.find(item => item._id === id);
        if (selectedTrack) {
            setTrack(selectedTrack);
            setPlayStatus(true);
        }
    };


    const previous = () => {
        const currentIndex = songsData.findIndex(item => item._id === track._id);
        if (currentIndex > 0) {
            setTrack(songsData[currentIndex - 1]);
            setPlayStatus(true);
        }
    };

    const next = () => {
        if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * songsData.length);
            setTrack(songsData[randomIndex]);
            setPlayStatus(true);
        } else {
            const currentIndex = songsData.findIndex(item => item._id === track._id);
            let nextIndex = currentIndex + 1;
            if (nextIndex >= songsData.length) nextIndex = 0;
            setTrack(songsData[nextIndex]);
            setPlayStatus(true);
        }
    };

    useEffect(() => {
        localStorage.setItem("myPlaylist", JSON.stringify(myPlaylist));
    }, [myPlaylist]);

    const addToMyPlaylist = (song) => {
        setMyPlaylist(prev => {
            if (!prev.some(item => item._id === song._id)) {
                return [...prev, song];
            }
            return prev;
        });
    };






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



    const seekSong = async (e) => {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)


    }

    const getSongData = async () => {
        try {

            const response = await axios.get(`${url}/api/song/list`);
            setSongData(response.data.songs);
            setTrack(response.data.songs[0]);

        } catch (error) {

        }
    }

    const getAlbumData = async () => {
        try {

            const response = await axios.get(`${url}/api/album/list`);
            setAlbumData(response.data.albums);
        } catch (error) {

        }
    }
    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {

                if (!audioRef.current.duration || isNaN(audioRef.current.duration)) {
                    // Prevent NaN display while loading
                    setTime({
                        currentTime: { second: 0, minute: 0 },
                        totalTime: { second: 0, minute: 0 }
                    });
                    return;
                }

                seekBar.current.style.width =
                    (Math.floor(audioRef.current.currentTime / audioRef.current.duration * 100)) + "%";

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


    useEffect(() => {
        getSongData();
        getAlbumData();
    }, []);

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus, setPlayStatus,
        time, setTime,
        play, pause,
        playWithId,
        previous, next,
        seekSong,
        songsData,
        albumsData,
        isLoop,
        toggleLoop,
        isShuffle,
        toggleShuffle,
        filter,
        setFilter,
        myPlaylist, addToMyPlaylist,
        removeFromMyPlaylist
    }

    return (

        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}
export default PlayerContextProvider;
