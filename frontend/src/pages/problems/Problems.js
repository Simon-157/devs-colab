
import SideBar from '../../components/navbar/side-nav/SideBar'
import Challenges from './Challenges'
import problemStyles from "./problem-styles.module.scss"

const Problems = (props) => {
  const date = new Date();
  return (
    <><div className={problemStyles.container}>
      <SideBar />
      <div className={problemStyles.problemsDiv}>
        <Challenges />
      </div>
    </div><div className="mt-8 p-4" style={{ position:"",color: "rgb(143, 189, 142) ", backgroundColor: "rgba(0, 0, 0, 0.2)" }}>
        @{date.getUTCFullYear()}
        <a href="https://tailwind-elements.com/"> Simon</a>
      </div></>
  )
}

export default Problems