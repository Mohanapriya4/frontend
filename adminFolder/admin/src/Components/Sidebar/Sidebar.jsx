import React from 'react'
import './Sidebar.css'
import { Link } from 'react-router-dom'
import Add_Product_icon from '../../assets/Product_Cart.svg'
import List_Product_icon from '../../assets/Product_list_icon.svg'

const Sidebar = () => {
  return (
    <div className='sidebar'>
        <Link to={'/addproduct'} style={{textDecoration:"none"}}>
           <div className="sidebar-item">
            <img src={Add_Product_icon} alt="" />
            <p>Add Product</p>
           </div>
        </Link>
        <Link to={'/listproduct'} style={{textDecoration:"none"}}>
           <div className="sidebar-item">
            <img src={List_Product_icon} alt="" />
            <p>Product List</p>
           </div>
        </Link>

    </div>
  )
}

export default Sidebar