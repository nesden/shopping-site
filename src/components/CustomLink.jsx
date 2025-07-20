import React from 'react'
import { Link, resolvePath, useMatch, useResolvedPath } from 'react-router-dom'
import "../styles/CustomLink.css"
const CustomLink = ({ to, children, ...rest }) => {
  const { pathname } = useResolvedPath(to);
  const isActive = useMatch({ path: pathname, end: true });// checks if im in the same page as the link gets ne to
  return (

    <Link to={to} {...rest} className={`custom-link ${isActive ? "active" : ""}`}>
      {children}
    </Link >
  )

}

export default CustomLink