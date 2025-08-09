import React, { useEffect, useState } from 'react'
import Item from './Item'
import { addItemsToOrder, findAllItems, search, addToFavorites, removeFromFavorites, getAllFavorites } from '../services/ApiService';
import '../styles/Shop.css';

const Shop = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [searchBar, setSearchBar] = useState('');
    const [errorFromServer, setErrorFromServer] = useState('');

    const fetchItems = async () => {
        try {
            const data = await findAllItems();
            setItems(data.data);
        } catch (err) {
            console.error('Failed to load items:', err);
        }
    };

    useEffect(() => {

        fetchItems();
    }, []);


    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchBar.trim()) {
            const { data } = await findAllItems(); // reset if empty
            setItems(data);
            return;
        }
        try {
            const { data } = await search(searchBar);
            setItems(data);
        } catch (err) {
            setErrorFromServer('Search failed');
            setTimeout(() => {
                setErrorFromServer('');
                setIsLoading(false);
            }, 3000);
        }
    };
    const handleAddItem = async ({ itemId }) => {
        try {

            setIsLoading(true);
            const updatedItems = await addItemsToOrder(itemId);
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
    const handleGetFavorites = async () => {
        try {
            setIsLoading(true);
            const { data } = await getAllFavorites();
            setFavorites(data.map(item => item.id));
            setIsLoading(false);
        } catch (err) {
            console.error("getting favorites failed:", err);
            setErrorFromServer('Could not get favorites');
            setTimeout(() => {
                setErrorFromServer('');
                setIsLoading(false);
            }, 3000);
        }
    }
    useEffect(() => {
        handleGetFavorites();
    }, []);

    const handleAddToFavorites = async (itemId) => {
        try {

            setIsLoading(true);
            await addToFavorites(itemId);
            setFavorites(prev => [...prev, itemId]);
            setIsLoading(false);


        } catch (err) {
            console.error("Add failed:", err);

            setErrorFromServer('Could not add item to favorite');
            setTimeout(() => {
                setErrorFromServer('');
                setIsLoading(false);
            }, 3000);
        }
    }
    const handleRemoveFromFavorites = async (itemId) => {
        try {

            setIsLoading(true);
            await removeFromFavorites(itemId);
            setFavorites(prev => prev.filter(favId => favId !== itemId));

            setIsLoading(false);

        } catch (err) {
            console.error("remove failed:", err);

            setErrorFromServer('Could not remove item from favorite');
            setTimeout(() => {
                setErrorFromServer('');
                setIsLoading(false);
            }, 3000);
        }
    }


    return (

        <div className='shop-page'>

            <form onSubmit={handleSearch} className="search-bar">
                <input
                    type="text"
                    placeholder="Search items..."
                    value={searchBar}
                    onChange={(e) => setSearchBar(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            {errorFromServer && <p style={{ color: 'red' }}>{errorFromServer}</p>}

            <div className='items-list'>
                {items.map(item => (
                    <Item
                        key={item.id}
                        item={item}
                        handleAddItem={handleAddItem}
                        handleAddToFavorites={handleAddToFavorites}
                        handleRemoveFromFavorites={handleRemoveFromFavorites}
                        isFavorite={favorites.includes(item.id)}
                        isLoading={isLoading}
                    />
                ))}
            </div>

        </div>
    )
}

export default Shop