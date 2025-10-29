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



    const playWithId = async (id) => {
        await songsData.map((item) => {
            if (id === item._id) {
                setTrack(item);
            }
        })

        await audioRef.current.play();
        setPlayStatus(true);
    }

    const previous = async () => {
        songsData.map(async (item, index) => {

            if (track._id === item._id && index > 0) {

                await setTrack(songsData[index - 1]);
                await audioRef.current.play();
                setPlayStatus(true);
            }
        })
    }

    const next = async () => {
        if (isShuffle) {
            // Pick a random song
            const randomIndex = Math.floor(Math.random() * songsData.length);
            await setTrack(songsData[randomIndex]);
            await audioRef.current.play();
            setPlayStatus(true);
        } else {
            // Normal next logic
            songsData.map(async (item, index) => {
                if (track._id === item._id) {
                    let nextIndex = index + 1;
                    if (nextIndex >= songsData.length) nextIndex = 0;
                    await setTrack(songsData[nextIndex]);
                    await audioRef.current.play();
                    setPlayStatus(true);
                }
            })
        }
    };



    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.loop = isLoop;
        }
    }, [isLoop]);
    useEffect(() => {
        if (!audioRef.current) return;

        audioRef.current.onended = () => {
            if (!isLoop) {
                next(); // play next song
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
    }, [])

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
        setFilter
    }

    return (

        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}
export default PlayerContextProvider;
