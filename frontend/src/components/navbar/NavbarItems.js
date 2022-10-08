//utils
import { 
    HOME,
    LOGIN,
    PROBLEMS,
} from "../../utils/constants"

//components
import { 
    CodeIcon, 
    LoginIcon, 
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
   

    // {
    //     icon:<UserProfileIcon />,
       
    // },
]
