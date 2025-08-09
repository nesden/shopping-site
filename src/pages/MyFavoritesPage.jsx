import React, { useContext } from 'react'
import MyFavorites from '../components/MyFavorites'
import { useNavigate } from 'react-router-dom';
import UserContext from '../contexts/UserContext';
const MyFavoritesPage = () => {
    const navigate = useNavigate();
    const { currentUser, isRequestToGetCurrentUserDone } = useContext(UserContext);
    return (<div className='home'>
        {(isRequestToGetCurrentUserDone && !currentUser)
            &&
            <div>
                <h1>no entry</h1>
                <p> please log in to enjoy our store</p>
                <button className='login-btn' type='button' onClick={() => navigate("/Login")}> Login</button >
            </div>
        }
        {
            currentUser &&
            <div className='center'>
                <h1>your favorites</h1>
                <MyFavorites />
            </div>
        }
    </div>
    )
}

export default MyFavoritesPage