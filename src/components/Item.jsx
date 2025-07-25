import React, { useEffect, useState } from 'react'
import '../styles/Item.css'
import { addItemsToOrder, getAllOrdersByUser, purchase, removeFromCart } from '../services/ApiService';
import Order from './Order';

const Item = ({ item, handleAddItem, isLoading }) => {
    const [orders, setOrders] = useState([]);
    const [errorFromServer, setErrorFromServer] = useState("");

    return (

        <div className='item-card'>
            <img src={item.image} alt={item.name} className="item-image" />
            <h3>{item.name}</h3>
            <p>Amount: {item.amount}</p>
            <p>Price: {item.price}</p>

            <button
                onClick={() => handleAddItem({ itemId: item.id })}
                disabled={isLoading || item.amount === 0}
            >
                {isLoading ? 'Adding...' : 'Add to Order'}
            </button>

        </div >

    );
}

export default Item