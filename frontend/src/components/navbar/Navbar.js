//libraries
import {useContext} from "react"
import { NavLink } from "react-router-dom";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
} from "@material-tailwind/react";

//components
import ButtonC from '../button/Button';
import {NavigationButtons} from "./NavbarItems"
import {NotificationsIcon} from "../icons/SvgIcons"


//styles
import navbarStyles from "./navbar.module.scss"
import { userContext } from "../../contexts/userContext";
import ProfileCard from "./ProfileCard";

const Navbar = () => {
    const {currentUser} = useContext(userContext)

  return (
    <>
      <nav className={navbarStyles.navbar}>
        <div>
          <NavLink to="/" className={navbarStyles.navLogo}>
            DevColab
          </NavLink>

          {!currentUser &&NavigationButtons?.map((button) => {
          return (
              
              <ButtonC
                key={button.to}
                icon={button.icon}
                text={button.text}
                to={button.to}
              />
             );
            })
          }
        {currentUser &&
            <Popover 
              animate={{
              mount: { scale: 1, y: 0 },
              unmount: { scale: 0, y: 25 },
            }}>
              <PopoverHandler >
                <Button variant="gradient">
                  <img className = "inline mr-2 object-cover w-8 h-8 rounded-full" src={currentUser?.profileImg} alt={currentUser?.userName} />
                </Button>
              </PopoverHandler>
              <PopoverContent
              // className = "z-40"
              >
                <ProfileCard currentuser={currentUser} />
              </PopoverContent>
            </Popover>
          // {currentUser?.userName?.split(" ")[0]}
        }
        </div>
      </nav>
    
    </>
  );
}

export default Navbar;



 




