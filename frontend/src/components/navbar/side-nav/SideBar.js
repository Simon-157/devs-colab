//libraries


import { PROBLEMS } from "../../../utils/constants"
import { CodeIcon, GroupIcon } from "../../icons/SvgIcons"
import sidenavStyles from "./side-nav.module.scss"
import SideBarMenu from "./SideBarMenu"
const SideBar = () =>{

    return(
        <div className={sidenavStyles.container}>
            <div>
                <SideBarMenu
                    tag={PROBLEMS}
                    Icon2 = {<GroupIcon />}
                    Icon={<CodeIcon />} />
            </div>
        </div>
    )
}

export default (SideBar)