
import { PROBLEMS } from "../../../utils/constants"
import { problems } from "../../../utils/dummy"
import { CodeIcon } from "../../icons/SvgIcons"
import sidenavStyles from "./side-nav.module.scss"
import SideBarMenu from "./SideBarMenu"
const SideBar = () =>{
    console.log(problems)
    return(
        <div className={sidenavStyles.container}>
            <div>
                <SideBarMenu
                    tag = {PROBLEMS}
                    data = {problems}
                    Icon = {<CodeIcon />}
                />
            </div>
        </div>
    )
}

export default (SideBar)