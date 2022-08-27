import React, {useState} from 'react'
import SideBar from '../../components/navbar/side-nav/SideBar'
import problemStyles from "./problem-styles.module.scss"
import { problems } from '../../utils/dummy'

const Problems = () => {
    const [Challenges] = useState(problems)
  return (
    <div className={problemStyles.container}>
        <SideBar />
       <div className = {problemStyles.problemsDiv}>
            <h1>Challenges</h1>
            <div className = {problemStyles.problemCardsWrapper}>
            <div className = {problemStyles.problemsContainer}>
            {
                Challenges.map(challenge =>{
                    return(
                        <div
                            key = {challenge.id} 
                            onClick={() =>{window.open()}}
                            className = {problemStyles.problemCard}
                        >
                            <p>{challenge.title}</p>
                            <p>{challenge.content}</p>
                        </div>
                    )
                })
            }
            </div>
            </div>

       </div>
    </div>
  )
}

export default Problems