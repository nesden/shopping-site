import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import Registration from './pages/Registration'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Login from './pages/Login';
import NavBar from './components/Navbar'
import { fetchCurrentUser } from './services/ApiService';
import { useEffect, useState } from 'react';
import UserContext from './contexts/UserContext';
import Orders from './pages/Orders';
import MyFavoritesPage from './pages/MyFavoritesPage';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRequestToGetCurrentUserDone, setIsRequestToGetCurrentUserDone] = useState(false);



  const updateCurrentUserContext = (user) => {
    console.log("current user: " + JSON.stringify(user));
    setCurrentUser(user)
  }


  const getCurrentUserForContext = async () => {
    try {
      if (localStorage.getItem("token")) {
        const { data } = await fetchCurrentUser();
        updateCurrentUserContext(data)
      }
    } catch (err) {
      console.error("error fetching current user: ", err);
    }
    setIsRequestToGetCurrentUserDone(true);
  }
  useEffect(() => {
    getCurrentUserForContext();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone }}>
      <Router>
        <NavBar />
        <Routes>
          <Route path='/' element={<Home />} />
          {/* might need to be the login page since all users of the site must bew logged in */}
          <Route path='/register' element={<Registration />} />
          <Route path='/login' element={<Login />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/favorites' element={<MyFavoritesPage/>} />

          <Route path='*' element={<NotFound />} />



        </Routes>
      </Router>
    </UserContext.Provider>
  );
}


export default App;
