import React, { useEffect, useState } from 'react'
import Item from './Item'
import Order from './Order';
import { addItemsToOrder, findAllItems, getAllOrdersByUser } from '../services/ApiService';
import { data } from 'react-router-dom';
import Orders from './Orders';
import '../styles/Shop.css';

const Shop = () => {
    const [items, setItems] = useState([]);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorFromServer, setErrorFromServer] = useState('');

    const fetchItems = async () => {
        try {
            const data = await findAllItems();
            console.log("Fetched items:", data);
            setItems(data.data);
        } catch (err) {
            console.error('Failed to load items:', err);
        }
    };

    useEffect(() => {

        fetchItems();
    }, []);


    // const getCurrentUserOrders = async () => {
    //     try {
    //         const { data } = await getAllOrdersByUser();
    //         setOrders(data.reverse());
    //     } catch (err) {
    //         console.log(err);
    //     }
    // }
    //    
    const handleAddItem = async ({ itemId }) => {
        try {

            setIsLoading(true);
            const updatedItems = await addItemsToOrder(itemId);
            console.log("Updated items:", updatedItems);
            setOrders(updatedItems);
            // getCurrentUserOrders();

            await fetchItems();
            setIsLoading(false);


        } catch (err) {
            console.error("Add failed:", err);

            setErrorFromServer('Could not add item to order');
            setTimeout(() => {
                setErrorFromServer('');
                setIsLoading(false);
            }, 3000);
        }
    };

    return (

        <div className='shop-page'>
            <h2>Shop</h2>

            {errorFromServer && <p style={{ color: 'red' }}>{errorFromServer}</p>}

            <div className='items-list'>
                {items.map(item => (
                    <Item
                        key={item.id}
                        item={item}
                        handleAddItem={handleAddItem}
                        isLoading={isLoading}
                    />
                ))}
            </div>
            {/* 
            <h3>Your Order</h3>
            <div className='order-list'>
                <Orders orders={orders} />
            </div> */}
        </div>
        // <div className='orders-page'>
        //     <h2>items</h2>
        //     <div className='notes-list'>
        //         {items.map(item =>
        //             <Item

        //                 key={item.id}
        //                 image={item.image}
        //                 item={item}
        //                 amount={amount}
        //             />
        //         )}
        //     </div>
        // </div>
    )
}

export default Shop