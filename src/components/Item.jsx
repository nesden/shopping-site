import React from 'react'
import '../styles/Item.css'
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const Item = ({ item, handleAddItem, isLoading, isFavorite, handleRemoveFromFavorites, handleAddToFavorites }) => {

    return (

        <div className='item-card'>
            <img src={item.image} alt={item.name} className="item-image-shop" />
            <h3>{item.name}</h3>
            <p>Amount: {item.amount}</p>
            <p>Price: {item.price} $</p>

            <div className="item-actions">
                <button
                    onClick={() => handleAddItem({ itemId: item.id })}
                    disabled={isLoading || item.amount === 0}
                >
                    {item.amount <= 0 ? 'out of stock' : 'Add to Order'}

                </button>

                <button
                    onClick={() => isFavorite ? handleRemoveFromFavorites(item.id) : handleAddToFavorites(item.id)}
                    disabled={isLoading}
                >
                    {isFavorite ? <StarIcon /> : <StarBorderIcon/>}
                </button>
            </div >
        </div >
    );
}

export default Item