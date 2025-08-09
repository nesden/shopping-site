import React, { useContext } from 'react'
import '../styles/Orders.css'
// import '../components/Orders.jsx'
import OrdersComponent from '../components/OrdersComponent.jsx';
import UserContext from '../contexts/UserContext.js';
import { Navigate } from 'react-router-dom';

const Orders = () => {
    const { currentUser, isRequestToGetCurrentUserDone } = useContext(UserContext);
    return (

        <div>
            {
                (isRequestToGetCurrentUserDone && currentUser)
                &&
                <OrdersComponent />
            }

            {
                (isRequestToGetCurrentUserDone && !currentUser)
                &&
                <div className='center'>
                    <h2>please login to enter this page</h2>
                    <button className='login-btn' onClick={() => Navigate("/login")}>login</button>
                </div>
            }
        </div>

    )
}

export default Orders