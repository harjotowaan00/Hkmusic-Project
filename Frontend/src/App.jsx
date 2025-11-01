import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Player from "./components/Player";
import Display from "./components/Display";
import DisplayHome from "./components/DisplayHome";
import DisplayAlbum from "./components/DisplayAlbum";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import MyPlaylistPage from './pages/MyPlaylistPage';
import { PlayerContext } from "./context/PlayerContext";

const App = () => {
  const { audioRef, track } = useContext(PlayerContext);

  const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = React.useState(localStorage.getItem("role") === "admin");

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setIsAdmin(localStorage.getItem("role") === "admin");
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <div className="h-screen bg-black">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          !isLoggedIn ? (
            <Login
              onLogin={(role) => {
                setIsLoggedIn(true);
                setIsAdmin(role === "admin");
              }}
            />
          ) : (
            <Navigate to="/home" />
          )
        } />

        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/home" />} />

        {/* Private Routes with nested Display routes */}
        <Route path="/home" element={
          isLoggedIn ? (
            <>
              <div className="h-[90%] flex">
                <Sidebar />
                <Display /> {/* Parent route component */}
              </div>
              <Player />
            </>
          ) : (
            <Navigate to="/" />
          )
        }>
          {/* Nested routes rendered inside Display's <Outlet /> */}
          <Route index element={<DisplayHome />} /> {/* Default nested route */}
          <Route path="album/:id" element={<DisplayAlbum />} /> {/* Album nested route */}
        </Route>

        <Route path="/admin" element={isLoggedIn && isAdmin ? <Admin /> : <Navigate to="/" />} />
        <Route path="*" element={<Navigate to="/" />} />
         <Route path="/my-playlist" element={<MyPlaylistPage />} />
      </Routes>

      <audio ref={audioRef} src={track ? track.file : ""} preload="auto" />
    </div>
  );
};

export default App;
