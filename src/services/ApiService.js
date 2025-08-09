import axios from "axios";

const BASE_URL = "http://localhost:9000";

const setAuthHeader = (token) => {
    console.log("token: " + token);
    localStorage.setItem("token", token);
};

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        Authorization: `Bearer ${token}`
    };
};
export const removeAuthHeaders = () => {
    localStorage.removeItem("token");
};

export const register = (user) => {
    return axios.post(`${BASE_URL}/users/register`, user);
};

export const login = async (credentials) => {
    const { data } = await axios.post(`${BASE_URL}/authenticate`, credentials);
    const jwtToken = data.jwt
    setAuthHeader(jwtToken);
    return data;
};
export const fetchCurrentUser = () => {
    return axios.get(`${BASE_URL}/users`, { headers: getAuthHeaders() })
};

export const updateCurrentUser = (updatedCurrentUser) => {
    return axios.put(`${BASE_URL}/users`, updatedCurrentUser, { headers: getAuthHeaders() });
};

export const deleteCurrentUser = () => {
    return axios.delete(`${BASE_URL}/users`, { headers: getAuthHeaders() });
};

export const findAllItems = () => {//might need to do this not have to be user
    return axios.get(`${BASE_URL}/items`, { headers: getAuthHeaders() });
};
export const findItem = (itemId) => {
    return axios.get(`${BASE_URL}/items/${itemId}`, itemId, { headers: getAuthHeaders() });
};
 
export const search = (searchbar) => {
    return axios.get(`${BASE_URL}/items/search/${searchbar}`, { headers: getAuthHeaders() });
};
export const addToFavorites = (itemId) => {
    return axios.post(`${BASE_URL}/items/favorites/${itemId}`, {}, { headers: getAuthHeaders() });
};
export const removeFromFavorites = (itemId) => {
    return axios.delete(`${BASE_URL}/items/favorites/${itemId}`, { headers: getAuthHeaders() });
};

export const getAllFavorites = () => {
    return axios.get(`${BASE_URL}/items/favorites`, { headers: getAuthHeaders() });
};

export const addItemsToOrder = (itemId) => {
    return axios.post(`${BASE_URL}/items/cart/add/${itemId}`, {}, { headers: getAuthHeaders() });
};

export const removeFromCart = (itemId) => {
    return axios.post(`${BASE_URL}/items/cart/remove/${itemId}`, {}, { headers: getAuthHeaders() });
};

export const purchase = () => {
    return axios.post(`${BASE_URL}/items/cart/purchase`, {}, { headers: getAuthHeaders() });
};

export const getAllOrdersByUser = () => {
    return axios.get(`${BASE_URL}/items/orders`, { headers: getAuthHeaders() });
};

export const getItemsForOrder = (orderId) => {
    return axios.get(`${BASE_URL}/items/orders/${orderId}/items`, { headers: getAuthHeaders() });
};

// there is also get all orders but that is more for me to see all the orders