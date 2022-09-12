//libraries
import {useContext} from "react"
import { NavLink } from "react-router-dom";

//components
import Button from '../button/Button';
import {NavigationButtons} from "./NavbarItems"

//styles
import navbarStyles from "./navbar.module.scss"
import { userContext } from "../../contexts/userContext";

const Navbar = () => {
    const {currentUser} = useContext(userContext)

  return (
    <>
      <nav className={navbarStyles.navbar}>
        <div>
          <NavLink to="/" className={navbarStyles.navLogo}>
            DevColab
          </NavLink>

        {NavigationButtons?.map((button) => {
        return (
            
            <Button
              key={button.to}
              icon={button.icon}
              text={button.text}
              to={button.to}
            />
        );
      })}
        <button>
         <img className = "inline mr-2 object-cover w-8 h-8 rounded-full" src={currentUser?.profileImg} alt={currentUser?.userName} />
         {currentUser?.userName.split(" ")[0]}
        </button>
        </div>
      </nav>
    
    </>
  );
}

export default Navbar;