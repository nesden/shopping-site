import React, { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import "../styles/RegistrationForm.css"
import { useNavigate } from 'react-router-dom';
import { register } from '../services/ApiService';

const RegistrationForm = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    role: "USER"
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

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
    if (!isFormValid)
      return
    try {
      await register(formData);
      navigate("/login");
    } catch (err) {
      console.log(err);
      if (err.status == 400 || err.status == 500) {
        setErrorFromServer(err.response.data);
      }
      if (err.code == "ERR_NETWORK") {
        setErrorFromServer("network error try again later")
      }
      setTimeout(() => {
        setErrorFromServer("")
      }, 3000)
    }
  }

  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [errorFromServer, setErrorFromServer] = useState("");

  // Regular expressions for validations
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{3,23}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%])[A-Za-z\d!@#$%]{8,24}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]*$/; // change: regex for phone validation (is optional & only numbers)


  const validateField = (name, value) => {
    let error = "";
    if (!value.trim() && ["first_name", "last_name", "email", "username", "password"].includes(name)) {// if the name is in the array, a must 
      error = `${name.replace("_", " ")} is required`
    }
    else if (name == "username" && !usernameRegex.test(value)) {
      error = "username must be between 3 and 23 long and starts wןth a letter"
    }
    else if (name == "password" && !passwordRegex.test(value)) {
      error = "password must be between 8 and 24 long and needs uppercase letter and smaller one and special tag"
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
    const { first_name, last_name, email, username, password } = formData;
    setIsFormValid(
      Boolean(first_name && last_name && email && username && password) &&
      Object.values(errors).every(err => !err)
    )
  }, [errors]);


  return (
    <form className='registration-form' onSubmit={handleSubmit}>
      <h2>register</h2>
      <input
        type="text"
        placeholder='First name'
        name='first_name'
        value={formData.first_name}
        onChange={handleChange}
        className={errors.first_name ? 'input-error' : ""}
      />
      {errors.first_name && <p className='error-text'>{errors.first_name}</p>}


      <input
        type="text"
        placeholder='Last name'
        name='last_name'
        value={formData.last_name}
        onChange={handleChange}
        className={errors.last_name ? 'input-error' : ""}
      />
      {errors.last_name && <p className='error-text'>{errors.last_name}</p>}

      <input
        type="email"
        placeholder='email'
        name='email'
        value={formData.email}
        onChange={handleChange}
        className={errors.email ? 'input-error' : ""}
      />
      {errors.email && <p className='error-text'>{errors.email}</p>}

      <input
        type="tel"
        placeholder='phone number'
        name='phone'
        value={formData.phone}
        onChange={handleChange}
        className={errors.phone ? 'input-error' : ""}
      />
      {errors.phone && <p className='error-text'>{errors.phone}</p>}

      <input
        type="text"
        placeholder='address'
        name='address'
        value={formData.address}
        onChange={handleChange}
      />

      <input
        type="text"
        placeholder='username'
        name='username'
        value={formData.username}
        onChange={handleChange}
        className={errors.username ? 'input-error' : ""}
      />
      {errors.username && <p className='error-text'>{errors.username}</p>}


      <div style={{ position: "relative", marginBottom: "1rem", }}>
        <input
          type={showPassword ? "text" : "password"}
          placeholder='password'
          name='password'
          value={formData.password}
          onChange={handleChange}
          style={{ width: "98%", paddingRight: "0", paddingLeft: "0.5rem", marginBottom: "0" }}
          className={errors.password ? 'input-error' : ""}
        />

        <span onClick={togglePasswordVisibility}
          style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
          {showPassword ? <VisibilityIcon style={{ fontSize: "20px" }} /> : <VisibilityOffIcon style={{ fontSize: "20px" }} />}
        </span>
      </div>

      {errors.password && <p className='error-text'>{errors.password}</p>}

      {errorFromServer && <p className='error-text'>{errorFromServer}</p>}

      <button type='submit' disabled={!isFormValid} >register</button>
      <button type='button' onClick={() => navigate("/login")}> login</button >

    </form >
  )
}

export default RegistrationForm