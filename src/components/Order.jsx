import React, { useEffect, useState } from 'react'
import { getItemsForOrder, purchase, removeFromCart } from '../services/ApiService';
import '../styles/Order.css'

const Order = ({ order, refreshOrders }) => {
  const [items, setItems] = useState([]);
  const [errorFromServer, setErrorFromServer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [orders, setOrders] = useState([]);

  const fetchItems = async () => {
    try {
      const { data } = await getItemsForOrder(order.id);
      setItems(data);
    } catch (err) {
      console.error("Failed to load order items", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [order.id]);

  const handleRemoveFromCart = async (itemId) => {
    try {
      setIsLoading(true);
      const updatedItems = await removeFromCart(itemId)
      console.log("Updated items:", updatedItems);
      setOrders(updatedItems);
      await fetchItems();
      await refreshOrders();
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setErrorFromServer('Could not remove item from order');
      setTimeout(() => {
        setErrorFromServer('');
        setIsLoading(false);
      }, 3000);
    }

  }
  const handlePurchase = async () => {
    const conifrmPurchase = window.confirm("accepting this will buy your current order");
    if (conifrmPurchase) {
      try {
        await purchase();
        await refreshOrders();

      } catch (err) {
        console.log(err);
        if (err.status == 400 || err.status == 500) {
          setErrorFromServer(err.response.data);
        }
        if (err.code == "ERR_NETWORK") {
          setErrorFromServer("Network error. Please try again later.");
        }
        setTimeout(() => {
          setErrorFromServer("");
        }, 3000);
      }
    }
  }



  return (
    <div className="order-items-list">
      <div className="order-header">
        <div className="order-info">
          <h4>Order ID: {order.order_id}</h4>
          <p><strong>Date:</strong> {order.order_date}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total Price:</strong> ${order.full_price}</p>
          <p><strong>Shipping to:</strong> {order.order_shipping_address}</p>
        </div>
        {order.status === 'TEMP' && (
          <div className="purchase-button-container">
            <button onClick={() => handlePurchase(order.order_id)}>Purchase</button>
          </div>
        )}
      </div>
      <ul>
        {items.map(item => (
          <li key={item.ID} className="order-item">
            <img src={item.IMAGE} alt={item.NAME} className="item-image-order" />
            <div className="item-details">
              {item.NAME} – Quantity: {item.AMOUNT}, Price: {item.PRICE}
            </div>

            <div className="item-actions">
              {errorFromServer && <p style={{ color: 'red' }}>{errorFromServer}</p>}

              {order.status === 'TEMP' && (
                <button onClick={() => handleRemoveFromCart(item.ID)}>lower amount</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Order