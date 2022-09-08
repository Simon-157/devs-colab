
import SideBar from '../../components/navbar/side-nav/SideBar'
import Challenges from './Challenges'
import problemStyles from "./problem-styles.module.scss"

const Problems = (props) => {

  return (
    <div className={problemStyles.container}>
        <SideBar />
       <div className = {problemStyles.problemsDiv}>
           <Challenges />
       </div>
    </div>
  )
}

export default Problems