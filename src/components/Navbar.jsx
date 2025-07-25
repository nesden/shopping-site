import React, { useContext } from 'react'
import '../styles/Navbar.css'
import UserContext from '../contexts/UserContext';
import { removeAuthHeaders } from '../services/ApiService'
import { useNavigate } from 'react-router-dom';
import CustomLink from './CustomLink';


const Navbar = () => {

  const { currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone } = useContext(UserContext);

  const navigate = useNavigate();

  const logout = () => {
    setTimeout(() => {
      removeAuthHeaders();
      updateCurrentUserContext(null);
      navigate("/login");//will probably need to change to /login since the access to the site is limited without a user

    }, 1000)
  }
  return (
    <div className='navbar'>
      <CustomLink to={'/'}>really bad shop </CustomLink>
      <div className='navbar-links'>
        {(isRequestToGetCurrentUserDone && !currentUser) && <CustomLink to={'/login'}>Login</CustomLink>}
        {currentUser &&
          <div >
            <CustomLink to={'/profile'} >profile</CustomLink>
            <CustomLink to={'/orders'}>orders</CustomLink>
            <button onClick={logout}>Logout</button>


          </div>
        }

      </div>
    </div >
  )
}

export default Navbar