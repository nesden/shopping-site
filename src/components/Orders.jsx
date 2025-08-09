import React, { useEffect, useState } from 'react'
import '../styles/Orders.css'
import { addItemsToOrder, findAllItems, getAllOrdersByUser} from '../services/ApiService';
import Order from './Order';

const Orders = () => {
  const [items, setItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [errorFromServer, setErrorFromServer] = useState("");

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

  const getCurrentUserOrders = async () => {
    try {

      const { data } = await getAllOrdersByUser();
      setOrders(data.reverse());
    } catch (err) {
      setErrorFromServer('Could not get orders');
      console.error(err);
    }
  };

  useEffect(() => {
    getCurrentUserOrders();
  }, []);

  return (
    <div className='orders-page'>
      <h2>Your orders</h2>
      {errorFromServer && <p style={{ color: 'red' }}>{errorFromServer}</p>}
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map(order => (
          <Order key={order.id} order={order} refreshOrders={getCurrentUserOrders}/>
          
        ))
      )}
    </div>
  );
};

export default Orders