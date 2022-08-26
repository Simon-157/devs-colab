//libraries
import { NavLink } from "react-router-dom";

//components
import Button from '../button/Button';
import {NavigationButtons} from "./NavbarItems"

//styles
import navbarStyles from "./navbar.module.scss"

const Navbar = () => {

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
              key={button.text}
              icon={button.icon}
              text={button.text}
              to={button.to}
            />
        );
      })}
        </div>
      </nav>
    </>
  );
}

export default Navbar;