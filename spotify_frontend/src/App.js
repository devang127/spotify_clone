
import './output.css'
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { useState } from 'react';
import LoginComponent from './routes/Login';
import SignupComponent from './routes/Signup';
import HomeComponent from './routes/Home';
import LoggedInHomeComponent from './routes/LoggedInHome';
import UploadSong from './routes/UploadSong';
import MyMusic from './routes/MyMusic';
import SearchPage from './routes/SearchPage';
import SinglePlaylistView from './routes/SinglePlaylistView';
import { useCookies } from 'react-cookie';
import songContext from './context/songContext';
import Library from './routes/Library';
import LikeSong from './routes/LikeSong';
import LoggedInContainer from './containers/LoggedInContainer';

function App() {
  const [currentSong, setCurrentSong] = useState();
  const [soundPlayed, setSoundPlayed] = useState(null)
  const [isPaused, setIsPaused] = useState(true)
  const [cookie, setCookie] = useCookies(["token"])
  const [queue, setQueue] = useState([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(-1);
  const [currentTime, setCurrentTime] = useState(0);
  

  return (
    <div className="App font-poppins w-screen h-screen">
      <BrowserRouter>
        {cookie.token ? (
          // loggin 
            <songContext.Provider value={{
                currentSong,
                setCurrentSong,
                soundPlayed,
                setSoundPlayed,
                isPaused,
                setIsPaused,
                queue,
                setQueue,
                isShuffled,
                setIsShuffled,
                isRepeating,
                setIsRepeating,
                currentSongIndex,
                setCurrentSongIndex,
                currentTime,
                setCurrentTime,
                }}>
              <LoggedInContainer >
                <Routes>
                  <Route path="/" element={<Navigate to="/login"/>} />
                  {/* <Route path="/home" element={<LoggedInHomeComponent/>} /> */}
                  <Route path="/myMusic" element={<MyMusic/> } /> 
                  <Route path="/search" element={<SearchPage/>} /> 
                  <Route path="/uploadSong" element={<UploadSong/>} />
                  <Route path="/library" element={<Library />} /> 
                  <Route path="/playlist/:playlistId" element={<SinglePlaylistView/>} /> 
                  <Route path='/likeSong' element={<LikeSong/>} />
                  <Route path="*" element={<Navigate to="/likeSong"/>} />
                </Routes>
              </LoggedInContainer>
            </songContext.Provider>
        ) : (
        //  logout
          <Routes>
            <Route path="/home" element={<HomeComponent/>} />
            <Route path="/login" element={<LoginComponent/>} />
            <Route path="/signup" element={<SignupComponent/>} />
            <Route path="*" element={<Navigate to="/login"/>} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  );
}

export default App;
