import React from 'react'
import './Navbar.css'
import Nav_Logo from '../../assets/nav-logo.svg'
import Nav_Profile from '../../assets/nav-profile.svg'

const Navbar = () => {
  return (
    <div className='navbar'>
        <img src={Nav_Logo} alt="" className='nav-logo' />
        <img src={Nav_Profile} alt="" className='nav-profile'/>
    </div>
  )
}

export default Navbar