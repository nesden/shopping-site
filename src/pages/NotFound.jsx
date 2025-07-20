import React from 'react'
import { Link } from 'react-router-dom'
import '../styles/NotFound.css'

const NotFound = () => {
  return (
    <div className='not-found-container'>
      <div className="not-found-content">
        <h1 className='not-found-title'>404</h1>
        <p className='not-found-message'>oops the page you are looking for does not exist</p>
        <Link to={"/"} className="not-found-link">go back home</Link>
      </div>
    </div >
  )
}

export default NotFound