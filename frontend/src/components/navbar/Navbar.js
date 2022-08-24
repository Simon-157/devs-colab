import React from 'react'
import navbarStyles from "./navbar.module.scss"

const Navbar = () => {
  return (
  
    <div className={navbarStyles.wrapper}>
        <nav>
            <h2>
                login
            </h2>
            <h2>
                register
            </h2>
        </nav>
    </div>
  )
}

export default Navbar