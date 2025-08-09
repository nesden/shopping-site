import React, { useContext, useEffect, useState } from 'react'
import Orders from '../components/Orders'
import '../styles/Profile.css'
import UserContext from '../contexts/UserContext'
import { useNavigate } from 'react-router-dom'
import { deleteCurrentUser, removeAuthHeaders, updateCurrentUser } from '../services/ApiService';

const Profile = () => {
    const { currentUser, updateCurrentUserContext, isRequestToGetCurrentUserDone } = useContext(UserContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeletedAccount, setIsDeletedAccount] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorFromServer, setErrorFromServer] = useState("");
    const [isFormValid, setIsFormValid] = useState(true);

    useEffect(() => {
        if (currentUser) {
            setFormData(currentUser);
        }
    }, [currentUser]);



    // Regular expressions for validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]*$/; // change: regex for phone validation (is optional & only numbers)
    const validateField = (name, value) => {
        let error = "";
        if (!value.trim() && ["first_name", "last_name", "email"].includes(name)) {// if the name is in the array, a must 
            error = `${name.replace("_", " ")} is required`
        }
        else if (name == "email" && !emailRegex.test(value)) {
            error = "please enter a valid email"
        }
        else if (name == "phone" && value.trim() && !phoneRegex.test(value)) {
            error = "please enter a valid phone number"
        }
        setErrors({
            ...errors,
            [name]: error //saved as a key and value obj
        })
    }
    useEffect(() => {
        if (formData) {
            const { first_name, last_name, email } = formData;
            setIsFormValid(
                Boolean(first_name && last_name && email) &&
                Object.values(errors).every(err => !err)
            )
        }
    }, [errors]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
        validateField(name, value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return;

        try {
            const { data } = await updateCurrentUser(formData);//updates backend
            updateCurrentUserContext(data);//updates the front end
            setIsEditing(false);
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

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
        if (confirmDelete) {
            try {
                await deleteCurrentUser();
                setIsDeletedAccount(true);
                setTimeout(() => {
                    removeAuthHeaders();
                    updateCurrentUserContext(null);
                    navigate("/login");
                }, 3000);
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
        <div className='profile'>
            {(currentUser && isRequestToGetCurrentUserDone) &&
                < div className='center' >
                    {(formData && !isDeletedAccount) &&
                        <div>
                            <h2>your profile </h2>
                            <form className='profile-form' onSubmit={handleSubmit}>
                                <div className='form-group'>
                                    <label htmlFor="first_name" className='form-label'>First Name</label>
                                    <input type="text" name='first_name' value={formData.first_name}
                                        className={`form-input ${errors.first_name ? "input-error" : ""}`}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                    {errors.first_name && <p className='error-text'>{errors.first_name}</p>}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="last_name" className='form-label'>Last Name</label>
                                    <input type="text" name='last_name' value={formData.last_name}
                                        className={`form-input ${errors.last_name ? "input-error" : ""}`}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                    {errors.last_name && <p className='error-text'>{errors.last_name}</p>}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="email" className='form-label'>Email</label>
                                    <input type="email" name='email' value={formData.email}
                                        className={`form-input ${errors.email ? "input-error" : ""}`}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                    {errors.email && <p className='error-text'>{errors.email}</p>}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="phone" className='form-label'>Phone</label>
                                    <input type="tel" name='phone' value={formData.phone}
                                        className={`form-input ${errors.phone ? "input-error" : ""}`}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                    {errors.phone && <p className='error-text'>{errors.phone}</p>}
                                </div>
                                <div className='form-group'>
                                    <label htmlFor="address" className='form-label'>Address</label>
                                    <input type="text" name='address' value={formData.address}
                                        className={`form-input ${errors.address ? "input-error" : ""}`}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                    {errors.address && <p className='error-text'>{errors.address}</p>}
                                </div>

                                {errorFromServer && <p className='error-text'>{errorFromServer}</p>}

                                {!isEditing && <button type='button' className='edit-btn' onClick={() => setIsEditing(true)}>Edit</button>}
                                {isEditing && <button type='submit' className='save-btn' disabled={!isFormValid}>Save</button>}
                            </form>
                        </div>
                    }
                    {!isDeletedAccount ?
                        <button className='delete-btn' onClick={handleDeleteAccount}>Delete Your Account</button>
                        :
                        <h3>Your account has been deleted</h3>
                    }
                </div>
            }

            {/* the break point between being logged in and not */}

            {
                (isRequestToGetCurrentUserDone && !currentUser)
                &&
                <div className='center'>
                    <h1>no entry</h1>
                    <h2>please login to enter this page</h2>
                    <button className='login-btn' onClick={() => navigate("/login")}>login</button>
                </div>
            }

        </div >
    )
}

export default Profile   