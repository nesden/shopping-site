import React, { useEffect, useState } from 'react'
import { getItemsForOrder } from '../services/ApiService';
import '../styles/Order.css'

const Order = ({ order }) => {
  const [items, setItems] = useState([]);


  const fetchItems = async () => {
    try {
      const { data } = await getItemsForOrder(order.id);
      console.log("here ", data);

      setItems(data);
    } catch (err) {
      console.error("Failed to load order items", err);
    }
  };


  useEffect(() => {
    fetchItems();
  }, [order.id]);

  return (
    <div className="order-items-list">
      <h4>Order ID: {order.order_id}</h4>
      <p><strong>Date:</strong> {order.order_date}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Price:</strong> ${order.full_price}</p>
      <p><strong>Shipping to:</strong> {order.order_shipping_address}</p>
      <ul>
        {items.map(item => (
          <li key={item.id} className="order-item">
            <img src={item.IMAGE} alt={item.NAME} className="item-image" />
            <div className="item-details">
              {item.NAME} – Quantity: {item.AMOUNT}, Price: {item.PRICE}
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Order