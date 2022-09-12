//utils
import { 
    
    HOME,
    LOGIN,
    PROBLEMS,
    NOTIFICATIONS,


} from "../../utils/constants"



//components
import { 
    CodeIcon, 
    LoginIcon, 
    NotificationsIcon, 
    } from "../icons/SvgIcons"

export const NavigationButtons = [
   
    {
        icon:<CodeIcon />,
        text:PROBLEMS,
        to:`${HOME}${PROBLEMS}`
    },
    {
        icon:<LoginIcon />,
        text:LOGIN,
        to:`${HOME}${LOGIN}`
    },
    {
        icon:<NotificationsIcon />,
        text:NOTIFICATIONS,
        to:`${HOME}${NOTIFICATIONS}`
    },

    // {
    //     icon:<UserProfileIcon />,
       
    // },
]
