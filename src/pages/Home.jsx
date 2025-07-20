import React, { useContext } from 'react'
import "../styles/Home.css"
import Shop from '../components/Shop'
import UserContext from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const navigate = useNavigate();
  const { currentUser, isRequestToGetCurrentUserDone } = useContext(UserContext);
  return (
    <div className='home'>
      {(isRequestToGetCurrentUserDone && !currentUser)
        &&
        <div>
          <h1>welcome to the really bad shop</h1>
          <p> please log in to enjoy our store</p>
          <button className='login-btn' type='button' onClick={() => navigate("/Login")}> Login</button >
        </div>
      }
      {
        currentUser &&
        <div className='center'>
          <h1>welcome, {currentUser.first_name} {currentUser.last_name} </h1>
          <Shop />
        </div>
      }
    </div>
  )
}

export default Home