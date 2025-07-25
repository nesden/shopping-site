import React, { useEffect, useState } from 'react'
import '../styles/Orders.css'
import { addItemsToOrder, getAllOrdersByUser, purchase, removeFromCart } from '../services/ApiService';
import Order from './Order';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [errorFromServer, setErrorFromServer] = useState("");
  const [isLoading, setIsLoading] = useState(false);




  // const handleAddItem = async ({ itemId }) => {
  //   try {
  //     setIsLoading(true);
  //     const updatedItems = await addItemsToOrder(itemId);//was itemid
  //     setOrders(updatedItems);
  //     setIsLoading(false);
  //   } catch (err) {
  //     setErrorFromServer('Could not add item to order');
  //     setTimeout(() => {
  //       setErrorFromServer("");
  //       setIsLoading(false);
  //     }, 3000);
  //   }
  // };

  // const currentDate = new Date().toISOString().split("T")[0];
  //       const newNote = { text: newNoteText, creation_date: currentDate };
  //date of note change to make it for order if needed to use



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


  const handlePurchase = async () => {//stole from a place
    const conifrmPurchase = window.confirm("accepting this will buy your current order");
    if (conifrmPurchase) {
      try {
        await purchase();
        getCurrentUserOrders();
        // setIsPurchasing(true);
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

  const handleRemoveFromCart = async (itemId) => {
    try {
      await removeFromCart(itemId)
    } catch (err) {
      console.log(err);

    }
    getCurrentUserOrders();
  }





  return (
    <div className='orders-page'>
      <h2>Your orders</h2>
      {errorFromServer && <p style={{ color: 'red' }}>{errorFromServer}</p>}
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map(order => (
          <Order key={order.id} order={order} />

        ))
      )}


    </div>


  );
};

export default Orders