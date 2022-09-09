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
          <button data-popover-target="popover-bottom" data-popover-placement="bottom" type="button" class="text-white mb-3 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Bottom popover</button>
          <div data-popover id="popover-bottom" role="tooltip" class="inline-block absolute invisible z-10 w-64 text-sm font-light text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm opacity-0 transition-opacity duration-300 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800">
              <div class="py-2 px-3 bg-gray-100 rounded-t-lg border-b border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                  <h3 class="font-semibold text-gray-900 dark:text-white">Popover bottom</h3>
              </div>
              <div class="py-2 px-3">
                  <p>And here's some amazing content. It's very engaging. Right?</p>
              </div>
              <div data-popper-arrow></div>
          </div>

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
            {/* <Button> */}
           
            {/* </Button> */}
        </div>
      </nav>
    
    </>
  );
}

export default Navbar;