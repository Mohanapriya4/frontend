import React from 'react'
import '../NewsLetter/NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='newsletter'>
        <h1>Get Exclusive Offers On Your Emails</h1>
        <p>Subscribe to our newsletter and stay updated</p>
        <div>
            <input type='email' placeholder='ur email id'/>
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter