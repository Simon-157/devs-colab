import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { problems } from '../../utils/dummy'

import { v4 } from 'uuid';
import problemStyles from './problem-styles.module.scss'

const Challenges = () => {
    const [Challenges] = useState(problems)
    const navigate = useNavigate();
    const startSubmitHandler = (e) => {
        // navigate(`${v4()}`)
        navigate(`/problems/${v4()}`)
      };
    
  return (
    <div>
         <div className = {problemStyles.Header}><h1>Challenges</h1></div>
            <div className = {problemStyles.problemCardsWrapper}>
            <div className = {problemStyles.problemsContainer}>
            {
                Challenges.map(challenge =>{
                    return(
                        <div
                            key = {challenge.id} 
                            onClick={() =>{startSubmitHandler()}}
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
  )
}

export default Challenges