import React, { useState, useContext } from 'react'
import '../styles/LoginForm.css'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentUser, login } from '../services/ApiService';
import UserContext from '../contexts/UserContext'



const LoginForm = () => {
    const { updateCurrentUserContext } = useContext(UserContext)
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            setError("please enter username and password");
            setTimeout(() => {
                setError("");
            }, 3000);
            return;
        }
        try {
            await login({ username, password });
            const { data } = await fetchCurrentUser();
            updateCurrentUserContext(data);
            navigate("/")
        } catch (err) {
            console.log(err);
            if (err.status == 403 || err.status == 500) {
                setError(err.response.data)

            }
            if (err.code == "ERR_NETWORK") {
                setError("network error try again later")

            }
            setTimeout(() => {
                setError("");
            }, 3000);

        }
    }

    return (
        <form className='login-form' onSubmit={handleSubmit}>
            <h2>Login</h2>
            <input
                type="text"
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <div style={{ position: "relative", marginBottom: "1rem", }}>
                <input
                    type={showPassword ? "text" : "password"}
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "98%", paddingRight: "0", paddingLeft: "0.5rem", marginBottom: "0" }}
                />

                <span onClick={togglePasswordVisibility}
                    style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", cursor: "pointer" }}>
                    {showPassword ? <VisibilityIcon style={{ fontSize: "20px" }} /> : <VisibilityOffIcon style={{ fontSize: "20px" }} />}
                </span>
            </div>
            {error && <p className='error-text'>{error}</p>}


            <button type='submit'>Login</button>
            <button type='button' onClick={() => navigate("/register")}> Register</button >
        </form>
    )
}


export default LoginForm